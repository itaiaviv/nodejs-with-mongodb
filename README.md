# nodejs-with-mongodb
Project of an http server written in node.js and communicate with mongo-db.

# Prerequisites:
1. Download and install mongoDB server:
	1.1. Download msi from: https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.1-signed.msi
	1.2. run the downloaded file
	1.3. during installation select "Complete" installation --> Run Service as network service user
	1.4. Add mongoDB bin dir path to System Env var PATH
2. Download and install mongodb-database-tools
	2.1. Download zip file form: https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.8.0.zip
	2.2. Unzip the zipped file to a directory in your area
	2.3. Add mongodb database-database-tools bin dir path to System Env var PATH
3. Download and install node.js:
	3.1. Download msi from https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi and run as administrator
	3.2. Add nodejs installation dir path to System Env var PATH: C:\Program Files\nodejs\ 
	3.3. Add npm dir path to System Env var PATH: in windows: %APPDATA%\npm (or you can use the path: C:\Users\<username>\AppData\Roaming\npm)

# Instructions:

1. Clone the project into your project dir: git clone https://github.com/itaiaviv/nodejs-with-mongodb.git <project_dir_path>
2. Navigate to project dir: cd <project_dir_path>
3. Install required packages: npm install  (no need to mention the packages, it will take them from packages.json file)
4. go to server dir: cd server
5. run: node server.js
6. open web browser and navigate to: http://127.0.0.1/find

