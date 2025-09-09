#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "Error: dist folder not found. Build failed."
    exit 1
fi

echo "Build completed successfully!"
echo "The dist folder contains your built files ready for deployment."
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Make sure you have the GitHub Actions workflow set up (.github/workflows/deploy.yml)"
echo "2. Push your changes to the main branch"
echo "3. GitHub Actions will automatically build and deploy your site"
echo ""
echo "Your site will be available at: https://yourusername.github.io/eastleigh-turf-flow/"
