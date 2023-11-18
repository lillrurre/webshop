## Web shop

[![.github/workflows/frontend.yml](https://github.com/lillrurre/webshop/actions/workflows/frontend.yml/badge.svg)](https://github.com/lillrurre/webshop/actions/workflows/frontend.yml)
[![.github/workflows/backend.yml](https://github.com/lillrurre/webshop/actions/workflows/backend.yml/badge.svg)](https://github.com/lillrurre/webshop/actions/workflows/backend.yml)

****
Åbo Akademi web shop project, that requires a Django/React stack with a SQLite database.

****
### Install the project

#### Backend
First make sure you have python [installed](https://www.python.org/downloads/). Preferably Python 3.10 or newer.


**Upgrade or install pip**
```bash
python -m pip install --upgrade pip
```

**Install dependencies**
```bash
pip install -r requirements.txt
```

#### Frontend
[Install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) npm if you have not already.
You can also use yarn, or bun.

Make sure you are in the frontend directory. 

**Install dependencies**
Using npm
```bash
cd frontend
npm install
```
In case there is problems, try
```bash
cd frontend
npm i -D
```

**Build the frontend**
```bash
cd frontend
npm run build
```
This will create a new [build](./frontend/build) in the frontend project.

****
### Run the project

While developing, it is easier to run the frontend and backend as separate project.

**Migrate the database first**
```bash
python manage.py makemigrations
python manage.py migrate 
```

Make sure the tables from the **shop** model is migrated. If you are not sure, you can run

```bash
python manage.py makemigrations shop
python manage.py migrate shop
```

**Start the backend**
```bash
python manage.py runserver 
```

The bundled application can be found at [localhost:8080](http://localhost:8080).

For development, start the backend as usual, but start the frontend separately
```bash
cd frontend
npm start
```

****
### Files required for grading

* [requirements.txt](./requirements.txt) at the root of the project.
* [package.json](./frontend/package.json) in the frontend directory.
* [src](./frontend/src) in the frontend.
* [build](./frontend/build) on the frontend.

****
### Student information
* **Erik Ehrström**
* **erik.ehrstrom@abo.fi**


### Implemented requirements
- [x] Project folder
- [x] Backend
- [x] Frontend
- [x] Automatic database population (shop, landing page)
- [x] Browse (shop, landing page)
- [x] Search (shop, landing page)
- [x] Create account (register page)
- [x] Login (login page)
- [x] Add item (inventory page)
- [x] Add to cart (shop, landing page)
- [x] Remove from cart (shop, landing page)
- [x] Pay (shop, landing page)
- [x] Routing
- [x] Edit account (account page)
- [ ] Display inventory. The page does not fully implement the requirements. It shows:
  - [x] On sale
  - [x] Not on sale
- [x] Edit item (inventory page)

**NOTE, to keep track of the work, the [Features.md](./Features.md) was used. Some more details can be found there.**

****
### Additional info
* The application uses CSRF for user validation in the endpoints, to add some basic security.
  * This allows to secure some endpoints that should be accessed only by registered users.
* The application does not force any strict password checks or email verifications. 
* The application does not take all edge-cases into account, like an authorized user updating items that it should not update.
