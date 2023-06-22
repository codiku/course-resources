# Quiet down Nodemon 


[Info](You'll notice that Nodemon is quite chatty and displays a lot of message any time it re-compiles.
 If you want only the output of your code , just update your package.json start command, so it looks like this
 :'start': 'nodemon ./src/index.ts --quiet')