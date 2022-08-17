## Steps 1 to 7 of the Full Stack Store Locator

These resource files are convenient if you just want to see a map load with the basic location and search functionality, without use of Cloud SQL and the Distance Matrix API calls.

To run this sample without spending the time to read through [Build a full stack store locator steps 1 to 7](https://codelabs.developers.google.com/codelabs/full-stack-store-locator/), follow a few steps:
* Confirm your Google Cloud project and enable the AppEngine Flex API (step 2 in the guide)
* Create an API key with at least API restrictions on the Google Maps APIs
* If running locally, install Go; if running in Cloud Shell, Go is already set to go (pun intended)
* I recommend also adding an Application restriction for the API key to restrict use of the key to **http://localhost:8080** if running locally, or if running in Cloud Shell add the web preview URL (e.g. **https://8080-cs-1234567890-default.cs-us-east1-pkhd.cloudshell.dev/**)
* Modify the script src in **index.html** to use your API key
* Execute 'go run *.go' from /example-without-sql
* Browse the app in either localhost or with the Cloud Shell web preview
