# nodejs-with-mongodb
Project of an http server written in node.js and communicate with mongo-db.

# Prerequisites:
1. Create app dir:
	1.1. Run cmd in command prompt: MD c:\workspace\nvidia_app
2. Download and install mongoDB server:
	2.1. Download msi from: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.1-signed.msi
	2.2. run the downloaded file
	2.3. during installation select "Complete" installation --> Run Service as network service user
	2.4. Update Data Directory to be at C:\MongoDB\Server\7.0.1\data
	2.5. Update Log directory to be at C:\MongoDB\Server\7.0.1\log
	2.6. Add mongoDB bin dir path to System Env var PATH: C:\Program Files\MongoDB\Server\7.0\bin
3. Download and install mongodb shell:
	3.1. Download zip file from: https://downloads.mongodb.com/compass/mongosh-1.10.6-win32-x64.zip
	3.2. Unzip the zipped file to C:\MongoDB\mongo-tools\
	3.3. Add mongodb shell bin dir path to System Env var PATH: C:\MongoDB\mongo-tools\mongosh-1.10.6-win32-x64\bin
4. Download and install mongodb-database-tools
	4.1. Download zip file form: https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.8.0.zip
	4.2. Unzip the zipped file to C:\MongoDB\mongo-tools\
	4.3. Add mongodb database-database-tools bin dir path to System Env var PATH: C:\MongoDB\mongo-tools\mongodb-database-tools-windows-x86_64-100.8.0\bin
5. Download and install node.js:
	5.1. Download msi from https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi and run as administrator
	5.2. Add nodejs installation dir path to System Env var PATH: C:\Program Files\nodejs\ 
	5.3. Add npm dir path to System Env var PATH: %APPDATA%\npm (or you can use the path: C:\Users\<username>\AppData\Roaming\npm)

# Instructions:

1. Clone the project into your project dir: git clone https://github.com/itaiaviv/nodejs-with-mongodb.git <projectDir>
2. Navigate to project dir: cd <projectDir>
3. Install required packages: npm install  (no need to mention the packages, it will take them from packages.json file)
4. go to server dir: cd server
5. run: node server.js
6. open web browser and navigate to: http://127.0.0.1/find

