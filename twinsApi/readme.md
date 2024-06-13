# Twins Rest Api

## Create a virtual environment
```bash
python -m venv venv
```

## Activate the virtual environment
### On Windows
```bash
source venv/Scripts/activate
```

### On macOS/Linux
```bash
source venv/bin/activate
```

## Install FastAPI and uvicorn
```bash
pip3 install fastapi uvicorn
```

## Install other libraries
```bash
pip3 install bcrypt pyjwt sqlite
```

## Run the FastAPI application using uvicorn
```bash
uvicorn main:app --reload
```

## Angular Frontend
### Installation
1. Install Angular CLI
   ```bash
   npm install @angular/cli -g
   ```

2. Use the following command to download the dependencies
   ```bash
   npm install
   ```

3. Install Bootstrap with the following command:
   ```bash
   npm install bootstrap
   ```

4. Launch a server and open the browser by default automatically
   ```bash
   ng serve -o
   ```

5. Angular uses port 4200 by default. If you want to use another port, you can do
   ```bash
   ng serve --port=3500
   ```

## Using Dockerfile
### Compose all projects in upper than projects.
	```bash
	docker compose up --build
	```

### Run projects
	```bash
	docker compose
	```

### Delete all imanges and containers
	```bash
	docker compose down
	```

### Verify the container is running
	```bash
	docker ps
	```

### List all containers (including stopped ones)
	```bash
	docker ps -a
	```

### Stop the container (when necessary)
	```bash
	docker stop container-name-here
	```

### Remove the container (when necessary)
	```bash
	docker rm container-name-here
	```

### List all Docker images
	```bash
	docker images
	```

### Remove the specific image tagged as 'rapture'
	```bash
	docker rmi image-name-here
	```

### (Optional) Force remove the image and its intermediate layers
	```bash
	docker rmi -f image-name-here
	```

### Verify the image has been removed
	```bash
	docker images
	```


## License

### Intellectual Property
All intellectual property rights of the software belong exclusively to the owner. Reproduction, distribution, public communication, and transformation of this work are prohibited without the express authorization of the owner.

### Permission of Use
The owner grants permission to use the software only under the conditions stipulated in this license. Commercial use of the software is not permitted without prior written authorization from the owner.

### Limitations
- Redistribution of the software, either in its original or modified form, is not permitted without the explicit consent of the owner.
- Decompiling, reverse engineering, disassembling, or attempting to derive the source code of the software is not permitted without the owner's permission.
- Using the software to create derivative products is not permitted without the express authorization of the owner.

## Contact
For any questions, please do not hesitate to contact us at:
- eXdesy@gmail.com
```
