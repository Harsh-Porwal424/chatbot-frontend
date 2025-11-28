# Frontend Integration Guide

### Prerequisites
```bash
  Node.js 16.x or higher
  yarn package manager
  Backend server running
```


## Installation
**Install dependencies:**
   ```bash
   yarn install
   ```

### Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:9000

# Optional: Enable debugging
REACT_APP_DEBUG=true
```

## Running the Frontend

### Development Mode

```bash
yarn start
```

The application will start on `http://localhost:3000` and automatically open in your browser.

### Production Build

```bash
yarn build
```

This creates an optimized production build in the `build/` directory.

### Testing

```bash
yarn test
```

## Backend Integration Details

### API Endpoint Configuration

The frontend communicates with the backend through a single `/chat` endpoint:

```javascript
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:9000';
```

### Request Format

The frontend sends POST requests to `/chat` with this structure:

```javascript
{
  user_input: "User's message text",
  session_id: "unique-session-identifier"
}
```

### Response Handling

The backend returns responses in a structured JSON format that the frontend processes:

```javascript
{
  session_id: "string",
  response: {
    status: "success|failure",
    data: [
      {
        type: "readme|table|follow-up",
        content: "string|object|array"
      }
    ]
  }
}
```

## Message Rendering System

The frontend supports multiple content types from the backend:

### 1. README Content (`type: "readme"`)

Rendered as markdown with syntax highlighting:

```javascript
if (item.type === 'readme') {
  return (
    <div className="prose prose-sm max-w-none text-sm leading-relaxed border rounded-xl px-5 py-4 shadow-sm text-slate-900 bg-white border-slate-200 mb-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.content}</ReactMarkdown>
    </div>
  );
}
```

**Table Content Structure:**
```javascript
{
  "type": "readme",
  "content": "",
}
```

### 2. Table Data (`type: "table"`)

Rendered using the DataTable component with export capabilities:

```javascript
else if (item.type === 'table') {
  return (
    <div className="mb-3">
      <DataTable tableContent={item.content} />
    </div>
  );
}
```

**Table Content Structure:**
```javascript
{
  "type": "table",
  "content": {
    "headers": ["Column1", "Column2"],
    "body": [["Row1Col1", "Row1Col2"], ["Row2Col1", "Row2Col2"]]
  }
}
```

### 3. Follow-up Questions (`type: "follow-up"`)

Rendered as clickable buttons that trigger new queries:

```javascript
else if (item.type === 'follow-up') {
  return (
    <div className="mt-4 border rounded-xl px-4 py-3 bg-slate-50 border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Related Questions</h3>
      <div className="space-y-2">
        {item.content.map((question, qIdx) => (
          <button
            key={qIdx}
            onClick={() => sendMessage(question)}
            className="w-full flex items-start gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg transition-colors group"
          >
            <CornerDownRight className="w-4 h-4 mt-0.5 text-slate-400 group-hover:text-blue-500 flex-shrink-0" />
            <span className="flex-1">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Table Content Structure:**
```javascript
{
  "type": "follow-up",
  "content": ["Question 1?", "Question 2?"]
}
```

## Error Handling

### Backend Failure Handling

When the backend is unavailable or returns errors, the frontend displays a user-friendly message:

```javascript
} catch (error) {
  console.error("Error sending message:", error);
  
  // Add error message to chat
  setMessages(prev => {
    const errorMessage = {
      role: "assistant",
      data: [{
        type: 'readme',
        content: "Due to some technical issues, we cannot process this request. Please try again later."
      }]
    };
    const finalMessages = [...prev, errorMessage];
    
    // Update chat with error message
    updateChatInStorage(chatId, { messages: finalMessages });
    
    return finalMessages;
  });
  
  toast.error("Failed to send message. Please try again.");
}
```

## Backend URL Configuration

Update CORS settings in the backend to allow your frontend domain:

```python
# In fastai_app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```


## Session Management

### Session ID Generation

The frontend generates unique session IDs for conversation continuity:

```javascript
const generateTempSessionId = () => {
  return `temp-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateChatId = () => {
  return `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
```

### Local Storage Persistence

Chat history is persisted in localStorage:

```javascript
const STORAGE_KEY = 'cleardemand_chats';

const loadChatsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading chats from localStorage:", error);
    return [];
  }
};

const saveChatsToStorage = (chats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error("Error saving chats to localStorage:", error);
  }
};
```

## UI Components

### DataTable Component

The DataTable component provides advanced table functionality:

- **Sorting**: Click column headers to sort
- **Filtering**: Global search functionality
- **Pagination**: Navigate through large datasets
- **Column Visibility**: Show/hide columns
- **Export**: Download data as CSV or Excel

### Message Components

- **User Messages**: Right-aligned with blue background
- **AI Messages**: Left-aligned with avatar and various content types
- **Typing Indicator**: Animated dots during backend processing

## Supported Features

### Chat Functionality

- **Real-time messaging**: Instant responses from backend
- **Message history**: Persistent chat sessions
- **Multiple chats**: Create and manage multiple conversations
- **Auto-scroll**: Automatically scroll to latest messages

### Content Types

- **Markdown rendering**: Full markdown support with GitHub Flavored Markdown
- **Interactive tables**: Sortable, filterable, and exportable tables
- **Follow-up questions**: Clickable suggestion buttons
- **Copy functionality**: Copy AI responses to clipboard

### User Experience

- **Responsive design**: Works on desktop and mobile
- **Keyboard shortcuts**: Enter to send, auto-focus on typing
- **Toast notifications**: Success/error feedback
- **Loading states**: Visual feedback during API calls

## File Structure

```
frontend/
├── src/
│   ├── App.js                 # Main application component
│   ├── components/
│   │   ├── DataTable.jsx      # Table component with export features
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   └── tableUtils.js      # Table utility functions
│   └── index.js               # Application entry point
├── public/
│   └── index.html            # HTML template
├── package.json              # Dependencies and scripts
└── .env                      # Environment configuration
```