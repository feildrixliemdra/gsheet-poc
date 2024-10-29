const { google } = require('googleapis')
const fs = require('fs')

// Load the service account credentials
const credentials = JSON.parse(fs.readFileSync('google-sheet-key.json'))

// Set up authentication
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

// Function to read data from a Google Sheet
async function readGoogleSheet() {
  const sheets = google.sheets({ version: 'v4', auth })
  console.log('sheet id', process.env.GSHEET_ID)

  const spreadsheetId = process.env.GSHEET_ID
  const range = 'Sheet1' // Adjust sheet name

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
    const rows = response.data.values

    if (rows.length) {
      // Get headers (first row)
      const headers = rows[0]
      const data = rows.slice(1).map((row) => {
        const obj = {}
        headers.forEach((header, index) => {
          obj[header] = row[index] || null // Assign each cell to its header, use null if cell is missing
        })
        return obj
      })

      console.log('Formatted Data:', data)
    } else {
      console.log('No data found.')
    }
  } catch (err) {
    console.error('Error reading the Google Sheet:', err)
  }
}

readGoogleSheet()
