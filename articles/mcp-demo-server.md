# MCP Demo Server: A Simple Python Server with Addition Tool

## Overview
The MCP Demo Server is a lightweight Python server that demonstrates basic functionality with a simple addition tool. This project serves as a great starting point for understanding server-side Python applications and tool integration.

## Features
- Simple addition tool that takes two integers and returns their sum
- Easy-to-use development mode with MCP Inspector
- Hot-reloading for faster development
- VS Code integration for seamless development experience

## Technical Stack
- Python 3.x
- mcp-python
- fastmcp

## Getting Started

### Prerequisites
- Python 3.x
- pip (Python package installer)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/jyonak/first-mcp
cd first-mcp
```

2. Create and activate a virtual environment:
```bash
# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install mcp-python fastmcp
```

### Running the Server

#### Method 1: Using Python directly
```bash
python server.py
```

#### Method 2: Using VS Code
1. Open the project in VS Code
2. Install the Python extension
3. Press `F5` or use the Run and Debug menu
4. Select "Run MCP Server" configuration

#### Method 3: Development Mode with MCP Inspector
```bash
# Basic server run
mcp dev server.py

# Run with additional dependencies
mcp dev server.py --with pandas --with numpy

# Mount local code for development
mcp dev server.py --with-editable .
```

## Project Structure
```
first-mcp/
├── .vscode/
│   └── mcp.json
├── .gitignore
├── README.md
└── server.py
```

## Configuration
The server configuration is managed through `.vscode/mcp.json`, which includes:
- Time server configuration for timezone management
- Add server configuration for the demo addition tool

## Development Features
- VS Code integration for Python development
- Code linting and auto-formatting
- Hot-reloading for faster development
- MCP Inspector for debugging

## Use Cases
This demo server is perfect for:
- Learning Python server development
- Understanding tool integration in Python
- Testing MCP functionality
- Starting a new Python server project

## Future Enhancements
Potential improvements for the project:
- Add more mathematical operations
- Implement error handling
- Add API documentation
- Include unit tests
- Add database integration

## Resources
- [GitHub Repository](https://github.com/jyonak/first-mcp)
- [Python Documentation](https://docs.python.org/)
- [MCP Python Documentation](https://docs.mcp-python.org/) 