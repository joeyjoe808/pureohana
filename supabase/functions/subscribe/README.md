# Newsletter Subscription Edge Function

This Edge Function provides a secure way to handle newsletter subscriptions.

## Features

- Email validation before processing
- Rate limiting to prevent abuse
- Duplicate subscription checking
- CORS configuration for cross-domain requests
- Secure error handling that doesn't leak internal information
- Proper HTTP status codes for different responses

## Security Considerations

1. **Input Validation**: All input is validated before processing
2. **Rate Limiting**: Prevents abuse by limiting requests per IP address
3. **Error Handling**: Provides appropriate error messages without exposing internals
4. **CORS Configuration**: Properly configured for secure cross-domain requests

## Deployment Notes

This function is automatically deployed to Supabase. The function endpoint will be:

```
https://[YOUR_SUPABASE_PROJECT].functions.supabase.co/subscribe
```

## Testing the Function

To test the function using cURL:

```bash
curl -X POST https://[YOUR_SUPABASE_PROJECT].functions.supabase.co/subscribe \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"website"}'
```

## Function Parameters

- `email` (required): The email address to subscribe
- `source` (optional): The source of the subscription (defaults to "website")

## Response Codes

- `201`: Subscription successful
- `400`: Invalid input
- `409`: Email already exists
- `429`: Rate limit exceeded
- `500`: Server error

## Troubleshooting

1. **CORS Errors**: Make sure your domain is added to the CORS allowed origins in the Supabase dashboard
2. **Authentication Errors**: Check that you're passing the correct Supabase anon key
3. **Rate Limiting**: If you're getting 429 errors, you may be exceeding the rate limit