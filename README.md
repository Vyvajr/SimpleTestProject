# RUN THE APPLICATION

1. Go to project dir via comand line interface
    - cd {PROJECT_DIR}
2. Execute docker compose command
    - docker-compose up

# STOP THE APP

1. Go to project dir via comand line interface
    - cd {PROJECT_DIR}
2. Run the following command
    - docker-compose down --rmi all

# RUN A TEST

!! Do nut run the tests when the app is running you will get a port issue.
1. Go to project dir via comand line interface
    - cd {PROJECT_DIR}
2. Run command to execute tests
    - npm run test:windows <-- WINDOWS
    - npm run test:linux   <-- LINUX

# API`s will be available on port 3001
### get tree view
    curl --location --request GET 'localhost:3001/category/treeView'
### add a category
    curl --location --request POST 'localhost:3001/category' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "categoryId": "Blue Shirt",
        "ancestors": ["Clothing", "Men Clothing", "Shirts"],
        "price": 100
    }'
### get sales
    curl --location --request GET 'localhost:3001/category/sales/Blue Shirt'