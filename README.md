# MOOAKO310_fto2401_GroupA_MoosaAkoodie_FSJ01

# E-Commerce Store
Welcome to the E-Commerce Store project! This project is a modern, responsive e-commerce application built with Next.js. It features a clean, well-organized structure and follows best practices for readability and maintainability.

# Project Structure
The project is organized as follows:

/app: Contains application components and pages.

/app/fonts: Custom font files.
/app/favicon.ico: Favicon for the application.
/app/globals.css: Global styles for the application.
/app/layout.css: Layout-specific styles.
/app/page.js: Main entry point for the Home page.
/app/products/page.js: Products page with pagination and product listing.
/app/products/[id]/page.js: Product Details per item
/components: Reusable React component/s.

/styles: CSS modules and other styling files.

# Features
HomePage: Displays a welcome message and a list of featured products.

Sign in/up functionality
Fetches featured products from an API.
Shows loading and error states.
Includes a button to navigate to the Products page.
ProductsPage: Lists products with pagination controls.

Fetches products based on the current page number.
Displays a grid of product cards with links to product details.
Includes pagination buttons for navigating between pages.
ProductDetailsPage: Shows detailed information about a selected product.

Fetches product details based on the product ID.
Displays product images, title, description, price, category, tags, rating, stock status, and reviews.
Leave an item review option(not working yet though)

Code Quality
The codebase is structured to ensure:

Well-Organized Files: Components and styles are logically arranged.
Readable Code: Code is clean and follows best practices for readability.
Documentation: Each component and function is documented with JSDoc comments, explaining their purpose, parameters, return values, and potential errors.
Maintainability: The project adheres to modern React and Next.js best practices, ensuring ease of maintenance and scalability.
Getting Started
Clone the Repository

bash
Copy code
git clone <repository-url>
Install Dependencies

# Navigate to the project directory and install the required dependencies:

bash
Copy code
cd <project-directory>
npm install
Run the Development Server(use: npm run dev)

Start the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser to view the application.

# Build for Production

To create an optimized production build, run:

bash
Copy code
npm run build
You can then start the production server with:

bash
Copy code
npm start
License
This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgements
Next.js for the framework.
Vercel for hosting the Next.js application.

 Languages:
  HTML
  CSS
  JAVASCRIPT

 Ai:
  ChatGPT
