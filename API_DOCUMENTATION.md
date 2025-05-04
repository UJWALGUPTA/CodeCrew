# CodeCrew API Documentation

This document outlines the available API endpoints for the CodeCrew platform.

## Base URL

All API endpoints are relative to the base URL of your CodeCrew instance:

- Local development: `http://localhost:5000`
- Production: Depends on your deployment URL

## Authentication

Most API endpoints require authentication. Include a valid session cookie in your requests.

To authenticate:

1. Complete the GitHub OAuth flow by visiting `/api/auth/github`
2. The session will be established via cookies automatically

## API Endpoints

### Authentication

#### Get Current User

```
GET /api/auth/me
```

**Response**
```json
{
  "id": 1,
  "username": "username",
  "githubId": "12345678",
  "email": "user@example.com",
  "avatarUrl": "https://github.com/avatars/u/12345678",
  "role": "contributor",
  "tokenBalance": 1000,
  "walletAddress": "0x1234..."
}
```

#### Login

```
POST /api/auth/login
```

**Request Body**
```json
{
  "username": "username",
  "password": "password"
}
```

**Response**
```json
{
  "id": 1,
  "username": "username",
  "role": "contributor"
}
```

#### Logout

```
GET /api/auth/logout
```

**Response**
```
Status: 302 Found
Location: /
```

### GitHub Integration

#### Get GitHub App Details

```
GET /api/github/app-details
```

**Response**
```json
{
  "name": "app-name",
  "installUrl": "https://github.com/apps/app-name/installations/new",
  "configUrl": "https://github.com/apps/app-name/installations/configure"
}
```

#### Check if GitHub App is Installed for Repository

```
GET /api/github/check-app-installed/:owner/:repo
```

**Response**
```json
true
```

#### Get User GitHub Repositories

```
GET /api/github/repositories
```

**Response**
```json
[
  {
    "id": 123456789,
    "name": "repo-name",
    "fullName": "owner/repo-name",
    "description": "Repository description",
    "url": "https://github.com/owner/repo-name",
    "stars": 10,
    "forks": 5,
    "openIssues": 3,
    "isPrivate": false
  }
]
```

#### Get Sample Repositories

```
GET /api/github/sample-repositories
```

**Response**
```json
[
  {
    "id": 123456789,
    "name": "repo-name",
    "fullName": "owner/repo-name",
    "description": "Repository description",
    "url": "https://github.com/owner/repo-name",
    "stars": 10,
    "forks": 5,
    "openIssues": 3,
    "isPrivate": false
  }
]
```

#### Get Repository Issues

```
GET /api/github/repo-issues/:owner/:repo
```

**Response**
```json
[
  {
    "id": 123456789,
    "number": 1,
    "title": "Issue title",
    "body": "Issue description",
    "state": "open",
    "html_url": "https://github.com/owner/repo-name/issues/1",
    "labels": [
      {
        "name": "bug",
        "color": "ff0000"
      }
    ],
    "user": {
      "login": "username",
      "avatar_url": "https://github.com/avatars/u/12345678"
    }
  }
]
```

### Repositories

#### List User's Repositories

```
GET /api/repositories
```

**Response**
```json
[
  {
    "id": 1,
    "name": "repo-name",
    "fullName": "owner/repo-name",
    "description": "Repository description",
    "url": "https://github.com/owner/repo-name",
    "stars": 10,
    "forks": 5,
    "openIssues": 3,
    "isPrivate": false,
    "owner": "owner",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Create Repository

```
POST /api/repositories
```

**Request Body**
```json
{
  "name": "repo-name",
  "fullName": "owner/repo-name",
  "owner": "owner",
  "url": "https://github.com/owner/repo-name"
}
```

**Response**
```json
{
  "id": 1,
  "name": "repo-name",
  "fullName": "owner/repo-name",
  "description": null,
  "url": "https://github.com/owner/repo-name",
  "stars": null,
  "forks": null,
  "openIssues": null,
  "isPrivate": null,
  "owner": "owner",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Get Repository by ID

```
GET /api/repositories/:id
```

**Response**
```json
{
  "id": 1,
  "name": "repo-name",
  "fullName": "owner/repo-name",
  "description": "Repository description",
  "url": "https://github.com/owner/repo-name",
  "stars": 10,
  "forks": 5,
  "openIssues": 3,
  "isPrivate": false,
  "owner": "owner",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### Check if User is Repository Owner

```
GET /api/repositories/:id/is-owner
```

**Response**
```json
true
```

#### Get Repository Pool

```
GET /api/repositories/:id/pool
```

**Response**
```json
{
  "totalBalance": 1000,
  "availableBalance": 750,
  "dailyDeposited": 250,
  "activeBounties": 2,
  "totalPaid": 0
}
```

#### Fund Repository

```
POST /api/repositories/:id/fund
```

**Request Body**
```json
{
  "amount": 100
}
```

**Response**
```json
{
  "success": true,
  "pool": {
    "id": 1,
    "repositoryId": 1,
    "managerId": 1,
    "balance": 1100,
    "dailyDeposited": 350,
    "lastDepositTime": "2023-01-01T00:00:00.000Z",
    "isActive": true,
    "contractAddress": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Repository Issues

```
GET /api/repositories/:id/issues
```

**Response**
```json
[
  {
    "id": 1,
    "repositoryId": 1,
    "issueNumber": 1,
    "githubId": "123456789",
    "title": "Issue title",
    "description": "Issue description",
    "url": "https://github.com/owner/repo-name/issues/1",
    "state": "open",
    "type": "bug",
    "hasBounty": true,
    "reward": 100,
    "bountyAddedAt": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Issues

#### Get All Issues with Bounties

```
GET /api/issues
```

**Response**
```json
[
  {
    "id": 1,
    "title": "Issue title",
    "description": "Issue description",
    "repository": "owner/repo-name",
    "url": "https://github.com/owner/repo-name/issues/1",
    "reward": 100,
    "type": "bug",
    "labels": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Featured Issues

```
GET /api/issues/featured
```

**Response**
```json
[
  {
    "id": 1,
    "title": "Issue title",
    "description": "Issue description",
    "repository": "owner/repo-name",
    "url": "https://github.com/owner/repo-name/issues/1",
    "reward": 100,
    "type": "bug",
    "labels": [],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Claim Issue

```
POST /api/issues/:id/claim
```

**Response**
```json
{
  "success": true,
  "claim": {
    "id": 1,
    "userId": 1,
    "issueId": 1,
    "status": "claimed",
    "prUrl": null,
    "prNumber": null,
    "transactionHash": null,
    "completedAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Set Bounty for Issue

```
POST /api/issues/:id/set-bounty
```

**Request Body**
```json
{
  "amount": 100
}
```

**Response**
```json
{
  "success": true,
  "issue": {
    "id": 1,
    "repositoryId": 1,
    "issueNumber": 1,
    "githubId": "123456789",
    "title": "Issue title",
    "description": "Issue description",
    "url": "https://github.com/owner/repo-name/issues/1",
    "state": "open",
    "type": "bug",
    "hasBounty": true,
    "reward": 100,
    "bountyAddedAt": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Claims

#### Get User Claims

```
GET /api/claims
```

**Response**
```json
[
  {
    "id": 1,
    "issue": {
      "id": 1,
      "title": "Issue title",
      "url": "https://github.com/owner/repo-name/issues/1",
      "reward": 100
    },
    "repository": "owner/repo-name",
    "status": "claimed",
    "prUrl": null,
    "prNumber": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Recent Claims

```
GET /api/claims/recent
```

**Response**
```json
[
  {
    "id": 1,
    "repository": "owner/repo-name",
    "issueNumber": 1,
    "issueTitle": "Issue title",
    "reward": 100,
    "status": "claimed",
    "prUrl": null,
    "prNumber": null,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Link Pull Request to Claim

```
POST /api/claims/:id/link-pr
```

**Request Body**
```json
{
  "prUrl": "https://github.com/owner/repo-name/pull/1"
}
```

**Response**
```json
{
  "success": true,
  "claim": {
    "id": 1,
    "userId": 1,
    "issueId": 1,
    "status": "submitted",
    "prUrl": "https://github.com/owner/repo-name/pull/1",
    "prNumber": 1,
    "transactionHash": null,
    "completedAt": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Dashboard and Analytics

#### Get Dashboard Data

```
GET /api/dashboard
```

**Response**
```json
{
  "totalRepositories": 5,
  "totalIssues": 20,
  "totalBounties": 10,
  "totalRewards": 1000,
  "activeRepositories": 3,
  "activeClaims": 5
}
```

#### Get Rewards Chart Data

```
GET /api/charts/rewards
```

**Response**
```json
[
  {
    "date": "2023-01-01",
    "rewards": 100
  },
  {
    "date": "2023-01-02",
    "rewards": 200
  }
]
```

### Miscellaneous

#### Get Transaction History

```
GET /api/history
```

**Response**
```json
[
  {
    "id": 1,
    "type": "fund",
    "amount": 100,
    "repository": "owner/repo-name",
    "issue": null,
    "transactionHash": "0x1234...",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Popular Labels

```
GET /api/labels/popular
```

**Response**
```json
[
  {
    "name": "bug",
    "count": 10
  },
  {
    "name": "feature",
    "count": 5
  }
]
```

## Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "message": "Error message describing what went wrong"
}
```

### Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Webhooks

CodeCrew processes GitHub webhooks to automate various workflows. The webhook endpoint is:

```
POST /api/github/webhook
```

This endpoint is called by GitHub when events occur in connected repositories. It handles:

- Issue events (opened, closed, edited, etc.)
- Issue comment events
- Pull request events

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute per IP address
- 1000 requests per hour per user

When rate limits are exceeded, the API will respond with a `429 Too Many Requests` status code.

## Pagination

Some endpoints that return lists of items support pagination using query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Example:

```
GET /api/repositories?page=2&limit=50
```

The response will include pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 2,
    "limit": 50,
    "pages": 2
  }
}
```

## Filtering and Sorting

Some endpoints support filtering and sorting using query parameters:

- `sort`: Field to sort by
- `order`: Sort order (asc or desc)
- Various filter parameters specific to the endpoint

Example:

```
GET /api/issues?sort=reward&order=desc&type=bug
```