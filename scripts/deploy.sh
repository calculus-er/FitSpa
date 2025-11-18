#!/bin/bash

# Firebase Deployment Script for FitSpa
# This script handles deployment to different Firebase environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
check_firebase_cli() {
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed. Please install it first:"
        echo "npm install -g firebase-tools"
        exit 1
    fi
    print_status "Firebase CLI is installed"
}

# Check if user is logged in to Firebase
check_firebase_login() {
    if ! firebase login:list | grep -q "✓"; then
        print_warning "You are not logged in to Firebase. Please run:"
        echo "firebase login"
        exit 1
    fi
    print_status "Firebase login verified"
}

# Build the application
build_app() {
    print_status "Building the application..."
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi
    print_status "Build completed successfully"
}

# Deploy to Firebase
deploy_to_firebase() {
    local environment=${1:-production}
    
    print_status "Deploying to $environment environment..."
    
    case $environment in
        "production")
            firebase deploy --only hosting,firestore:rules,storage
            ;;
        "staging")
            firebase use staging
            firebase deploy --only hosting,firestore:rules,storage
            firebase use default
            ;;
        "functions")
            firebase deploy --only functions
            ;;
        "hosting")
            firebase deploy --only hosting
            ;;
        *)
            print_error "Unknown environment: $environment"
            echo "Available environments: production, staging, functions, hosting"
            exit 1
            ;;
    esac
    
    print_status "Deployment to $environment completed successfully"
}

# Main deployment function
main() {
    local environment=${1:-production}
    
    print_status "Starting Firebase deployment process..."
    print_status "Target environment: $environment"
    
    check_firebase_cli
    check_firebase_login
    build_app
    deploy_to_firebase $environment
    
    print_status "🚀 Deployment completed successfully!"
    print_status "Your FitSpa app is now live on Firebase Hosting!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [environment]"
    echo ""
    echo "Environments:"
    echo "  production  - Deploy to production (default)"
    echo "  staging     - Deploy to staging environment"
    echo "  functions   - Deploy only Cloud Functions"
    echo "  hosting     - Deploy only hosting"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy to production"
    echo "  $0 staging      # Deploy to staging"
    echo "  $0 functions    # Deploy only functions"
}

# Parse command line arguments
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_usage
    exit 0
fi

# Run main function with all arguments
main "$@"
