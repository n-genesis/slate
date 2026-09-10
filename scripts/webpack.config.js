import { fileURLToPath } from 'url';
import path from 'path';

// Fix for __dirname in Node.js ES6 environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // 1. Your ES6 entry file (e.g., uses "export default" or "export const")
  entry: './src/main.js', 
  mode: 'production',
  output: {
    filename: 'js/slate.min.js',
    path: path.resolve(__dirname, '../dist'),
    
    // 2. Expose the ES6 exports to the browser window
    library: {
      name: 'NGenModule',
      type: 'umd',
      // If your module uses 'export default', uncomment the line below:
      // export: 'default', 
    },
    clean: true,
  },
    // 3. Ensure Webpack searches both root and package node_modules for dependencies
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src'),
    ],
    alias: {
      
    },
    // Allows Webpack to find both symlinks and true workspace configurations
    symlinks: true 
  }
};
