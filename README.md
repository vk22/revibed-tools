## Project setup
This app contains both the backend and the frontend in a single repository.
```	
├── client
├── server
├── mongo
└── docker-compose.yml
```

### Clone Repository

```bash
git clone git@github.com:vk22/revibed-tools.git

```

Navigate to the root directory.

```bash
$ cd revibed-tools
```
### Start app containers

Start the `client`, `server`, `db` and `mongo-seed` containers using docker-compose

```	bash
$ docker-compose build
$ docker-compose up -d 
```
Access the app from your browser at http://localhost:9000