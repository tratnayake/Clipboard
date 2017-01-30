# Clipboard

## Setup Instructions

1. Clone the project ``git clone``
2. If you have docker-compose, start the db by doing ``docker-compose db up``
3. If you don't have docker-compose, you will need to start up a PG database running on ``localhost`` and run ``db/init-user-db.sh``
4. NPM install all the things ``npm install``
5. Set environment variables (``sh test/API_tests/test.sh``) (OR run the shell commands below)
6. Spin up server ``npm start``


Note: Server will be listening on ``localhost:8080``

## Testing Instructions

1. Install mocha ``npm install -g mocha``
2. Go into the tests folder and simply run ``mocha <name of file>``

## Environment Variables
If the bash script does not add all the necessary environment variables, simply run the following in a terminal:

```
export ENV=TEST
export DB_USERNAME=clipboard_docker
export DB_PASSWORD=clipboard_docker
export DB_NAME=clipboard_docker
export DB=clipboard_docker
export ENDPOINT=http:localhost:8080
```
