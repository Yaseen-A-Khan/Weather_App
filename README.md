# ReactJS Weather App with Jenkins and Docker

This project demonstrates how to build and deploy a ReactJS weather app using Jenkins and Docker.

## Prerequisites

- Node.js
- Docker
- Jenkins (configured with necessary plugins)

## Setup

1. **Clone Repository:**

2. **Configure Jenkins Pipeline:**

   - Go to your Jenkins dashboard:
     - Click on **New Item** to create a new project.
     - Choose **Multibranch Pipeline** and click **OK**.
     - Give some Display name for your project.
     - In the Branch Sources section, Click on add resource dropdown and select single repository and branch.
     - Give some name and paste your GitHub repository URL in the **Repository URL** field and also you can specify the branch as well.
     - Apply and save the configuration.

3. **Set up Docker Hub Credentials in Jenkins:**

   - Go to your Jenkins dashboard and click on **Manage Jenkins**.
   - Navigate to **Configure System**.
   - Scroll down to the **Global properties** section and check the box for **Environment variables**.
   - Define the following environment variables:
     - `APP_NAME`: weatherapp
     - `DOCKER_PASS`: docker_hub_password
     - `DOCKER_USER`: docker_hub_username

5. **Build and Push Docker Image:**
   - The pipeline will build and push the Docker image to your Docker Hub registry.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the ReactJS application:

- `REACT_APP_WEATHER_KEY`: open_weather_api_key

## Dockerfile

The Dockerfile sets up a Node.js environment and installs dependencies.

## Jenkins Pipeline

If you want jenkins pipeline trigger automatically and build when you push code to github
#
## Jenkins-GitHub Integration with Ngrok

## Prerequisites

- Ngrok: Download and install ngrok from [ngrok.com](https://ngrok.com/).
- Jenkins: Ensure Jenkins is running and configured with the necessary plugins, including Multibranch Pipeline Scan Trigger Plugin.
- GitHub: Have your repository set up on GitHub.

## Steps

1. **Expose Jenkins with Ngrok:**
   - Open Terminal window and run `ngrok http 8080`, this will create a secure tunnel and provide you with a public URL that points to your Jenkins server.

2. **Create Multibranch Pipeline in Jenkins:**
   - Go to your Jenkins Dashboard.
   - Click on **New Item** to create a new Job.
   - Give a display name for your project.
   - In the Branch source section, Click on add resource dropdown and select single repository and branch.
   - Paste your GitHub repository URL in the Repository URL field and also specify the branch you want to monitor.
   - Under **Advanced**, check the box for **Scan by webhook** and give it a secret token `[myToken]`. This token will be used in the next step to secure webhook connections.
   - Click **Apply** and then **Save**.

3. **Create a webhook in GitHub:**
   - Go to your GitHub repository settings.
   - Navigate to the **Webhooks** section.
   - Click **Add webhook**.
     - **Payload URL**: Enter the public URL provided by ngrok in step 1 (`ngrok_url/multibranch-webhook-trigger/invoke?token=[myToken]`).
     - Change content type to **application/json**.
     - Events: Choose the events you want to trigger the webhook (e.g., push, pull request).
     - Check the active checkbox and click **Add webhook**.

4. **Testing:**
   - Make some changes in your code and push it to GitHub.
   - Jenkins should receive a notification from GitHub and automatically trigger a build for the corresponding branch.
   - You can monitor the build progress in the Jenkins console or build history.

## Usage

1. Run the Jenkins pipeline.
2. Access your ReactJS weather app via the Docker container.
