const express = require("express");
const { MongoClient } = require('mongodb');
const app = express();
const ejs = require('ejs');
let dbClient;

// TODO: Set the following parameters before run the server
const port = 8080;
const bsonFilePath = '../data/nvidiaDB/mnf_data.bson';
const uri = `mongodb://127.0.0.1:27017`;
const dbName = 'nvidia';
const collection = 'mnf_data';

async function connectToMongoDB() {
  try {
	const client = new MongoClient(`${uri}/${dbName}`);
    await client.connect();
    console.log(`Connected to MongoDB. Restoring ${collection} from bson file ${bsonFilePath}...`);
	//Restore mnf_data collection into mongoDB service
	require('child_process').execSync(`mongorestore --drop --uri ${uri} --db ${dbName} --collection ${collection} ${bsonFilePath}`,{stdio: 'inherit'});
	console.log(`MongoDB data restored successfully\n`);

    // Return the MongoDB client instance
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from views directory
app.use(express.static('views'));

// Middleware to establish MongoDB connection on first DB request and add logging - lazy evaluation
app.use(async (req, res, next) => {
	if (!dbClient) {
		dbClient = await connectToMongoDB();
	}
	req.dbClient = dbClient; // Attach the MongoDB client to the request object
	next();
}, (req, res, next) => {
	console.log(`A new request has arrived to our server: ${req.method} ${req.originalUrl} `);
	next();
});

app.set('view engine','ejs');

let totalItemsCount;
let pnEnum;
let testTypeEnum;

async function initDBVars(db, srcQuery) {
	if(!totalItemsCount){
		totalItemsCount = await db.collection(collection).countDocuments(srcQuery);
	}
	if(!pnEnum){
		pnEnum = await db.collection(collection).distinct("PN",srcQuery);
	}
	if(!testTypeEnum){
		testTypeEnum = await db.collection(collection).distinct("TEST_TYPE",srcQuery);
	}
}

let lastQueryCount;
let lastQueryPassCount;

async function calcPassRate(db,srcQuery) {
	
	let passQuery = Object.assign({}, srcQuery);;
	passQuery.PASS = 1;
	lastQueryPassCount = await db.collection(collection).count(passQuery);
	lastQueryCount = await db.collection(collection).count(srcQuery);
	const passRate = lastQueryCount == 0 ? 0 : (lastQueryPassCount / lastQueryCount * 100);
	return Math.trunc(passRate);
}

app.get('/findAll',async (req,res) => {
	try{
		const db = dbClient.db();
		const startDate = req.query.startDate;
		const endDate = req.query.endDate;
		// Validate start and end dates
		const currentDate = new Date().toISOString().split('T')[0];
		if (startDate && endDate) {
			if (startDate > endDate) {
				return res.status(400).json({ error: 'Start date must be less than or equal to end date.' });
			}
			if (startDate > currentDate || endDate > currentDate) {
				return res.status(400).json({ error: 'Start and end dates cannot be greater than today\'s date.' });
			}
		}
		let query = {};
		if(req.query.PN) {
			query.PN = req.query.PN;
		}
		if(req.query.TEST_TYPE) {
			query.TEST_TYPE = req.query.TEST_TYPE;
		}
		if (req.query.startDate && req.query.endDate) {
			const startDate = new Date(req.query.startDate);
			const endDate = new Date(req.query.endDate);

			query.TEST_DATE = {
				$gte: startDate,
				$lte: endDate,
			};
		}
		await initDBVars(db,query);
		const data = await db.collection(collection).find(query).sort({TEST_DATE : 1}).toArray();
		if(data) {
			console.log(`Found ${data.length} results\n`);
			res.json(data);
		} else {
			console.log('No items found with the user\'s filter\n');
			res.json({ message: 'No items found with the user\'s filter\n' });
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('/find', async (req, res) => {
  try {
	const db = dbClient.db();
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const pageSize = 10;
	const skip = (page -1) * pageSize;
	
	const startDate = req.query.startDate;
	const endDate = req.query.endDate;

	// Validate start and end dates
	const currentDate = new Date().toISOString().split('T')[0];
	if (startDate && endDate) {
		if (startDate > endDate) {
			return res.status(400).json({ error: 'Start date must be less than or equal to end date.' });
		}
		if (startDate > currentDate || endDate > currentDate) {
			return res.status(400).json({ error: 'Start and end dates cannot be greater than today\'s date.' });
		}
	}
	
	let query = {};
	
	if(req.query.PN) {
		query.PN = req.query.PN;
	}
	if(req.query.TEST_TYPE) {
		query.TEST_TYPE = req.query.TEST_TYPE;
	}
	if (req.query.startDate && req.query.endDate) {
		const startDate = new Date(req.query.startDate);
		const endDate = new Date(req.query.endDate);

		query.TEST_DATE = {
			$gte: startDate,
			$lte: endDate,
		};
	}
	
	await initDBVars(db,query);
	const cursor = db.collection(collection).find(query).sort({TEST_DATE : 1}).skip(skip).limit(pageSize);
    const data = await cursor.toArray();
	
	if(data) {
		const passRate = await calcPassRate(db,query);
		console.log(`Found ${data.length} results\n`);
		res.render('index.ejs', { data, page, pageSize, passRate,lastQueryCount,lastQueryPassCount, req, pnEnum, testTypeEnum });
	} else {
      console.log('No items found with the user\'s filter\n');
      res.json({ message: 'No items found with the user\'s filter\n' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.status(404).json({error: `Illegal URL. ${req.originalUrl} is not supported`});
})

// Close the MongoDB connection when the server is closing by user (ctrl+c)
process.on('SIGINT', async () => {
	if(dbClient) {
		await dbClient.close();
		console.log('Closed MongoDB connection');
	}
	process.exit(0);
});

// Start the Express server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Handle server closing event
server.on('close', () => {
	if(dbClient) {
		dbClient.close();
		console.log('Closed MongoDB connection');
	}
});