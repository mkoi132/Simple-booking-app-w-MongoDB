- This application is configured to run in development environment only.
- It is required to have Node and npm pre-installed on the machine so that you can run the app.

-- To spin up the application, change working directory to mydbapp/
-- Then execute the command 'npm init' {this is important as it install all dependancies}
-- Once the npm init done, you might optionally run 'npm audit' {advisable by npm}
-- Finally, execute the command 'npm run dev' {This will spin up both express server and application at once}
-- Once you notice BOTH terminal response:
    " ✓ Compiled " and " app listening on port 5000 "
    means that the application is accessible via a web browser
    you MUST hit Ctrl+C to kill the application or it will run on the port forever

- Expressjs app: http://localhost:5000
- Nextjs front-end: http://localhost:3000


{IMPORTANT}: It is rare that the database can't be boot up automatically through "npm run dev" 
but just in case please attempt to start it manually.
From the directory mydbapp/
Execute: node src/server/db.js 
Then: npm run dev

