## Project setup
This app contains both the backend and the frontend in a single repository.
```	
├── Readme.md
├── server
├── docker-compose.yml
└── client
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

Start the `client`, `server` and `db` containers using docker-compose

```	bash
$ docker-compose up -d 
```
Access the app from your browser at http://localhost:9000