# Portfolio Website

This repository contains my personal portfolio website built with HTML, CSS, and JavaScript. I hosted it using GitHub Pages and configured GitHub Actions to automatically deploy the website whenever changes are pushed to the `main` branch.

## Step 1: Create the Repository

I created a new public GitHub repository named:

```text
Nandhabuilds.github.io
```

Using the `<username>.github.io` naming convention creates a GitHub Pages user site, so the website is published at the root URL instead of a project subdirectory.

## Step 2: Push the Project

After creating the repository, I initialized Git in my project folder and pushed the source code using the following commands:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/Nandhabuilds/Nandhabuilds.github.io.git
git push -u origin main
```

## Step 3: Add the Resume

I added my resume to the project as:

```text
resume.pdf
```

The "Download Resume" button on the website is already configured to point to this file. Whenever I update my resume, I simply commit and push the changes.

## Step 4: Configure GitHub Pages

To publish the website, I opened the repository settings and navigated to **Settings → Pages**.

Under **Build and deployment**, I selected:

```text
Source: GitHub Actions
```

The deployment workflow is stored in:

```text
.github/workflows/deploy.yml
```

Every push to the `main` branch automatically triggers the workflow and deploys the latest version of the website.

## Step 5: Verify the Deployment

Once the GitHub Actions workflow completed successfully, the website became available at:

```text
https://nandhabuilds.github.io
```

I also verified the deployment by checking the **Actions** tab in the repository.

## Updating the Website

Whenever I make changes to the website, I use the following commands:

```bash
git add .
git commit -m "Describe your changes"
git push
```

GitHub Actions automatically redeploys the updated website, so no manual deployment is required.

## Project Structure

```text
Nandhabuilds.github.io/
│
├── index.html
├── resume.pdf
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## Technologies Used

* HTML5
* CSS3
* JavaScript
* GitHub Pages
* GitHub Actions

## Live Website

 https://nandhabuilds.github.io/
