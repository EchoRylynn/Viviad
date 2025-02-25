# Inactivity Auto URL Opener (autoOpen.py)

This script detects user inactivity on a Windows system and automatically opens Viviad Homepage if the user is idle for a set duration. Before opening the URL, it displays a pop-up notification with a countdown, allowing the user to cancel or proceed immediately.

## Features
- **Inactivity Detection:** Monitors user input activity using `GetLastInputInfo`.
- **URL Check:** Ensures the URL is not already open in a browser before opening it.
- **Notification Pop-up:** Provides a countdown with options to stay or open the URL immediately.
- **Cooldown Mechanism:** Prevents the URL from opening too frequently.

## Requirements
- Python 3.x
- Required Python libraries:
  ```sh
  pip install psutil pygetwindow tk
  ```

## Configuration
Modify the following constants in the script as needed:
- **URL:** The webpage to open when the user is inactive.
- **INACTIVITY_THRESHOLD:** Time (in seconds) before detecting inactivity.
- **NOTIFICATION_COUNTDOWN:** Countdown duration before opening the URL.
- **BROWSER_PROCESS_NAMES:** List of browser processes to check if the URL is already open.

```python
# Configuration
URL = "http://127.0.0.1:5500/pre-index.html"  # Target URL
INACTIVITY_THRESHOLD = 5  # Time in seconds before detecting inactivity
NOTIFICATION_COUNTDOWN = 5  # Countdown before opening URL
BROWSER_PROCESS_NAMES = ["chrome", "firefox", "msedge"]  # List of browser names
```

## How It Works
1. The script continuously checks for user inactivity.
2. If the user is inactive for the set threshold, it checks if the target URL is already open.
3. If the URL is not open, a pop-up appears with a countdown.
4. The user can either **stay at current page** (cancel opening) or **go back to Homepage** (open URL immediately).
5. If no action is taken, the URL opens when the countdown ends.
6. A cooldown mechanism ensures the URL is not reopened too frequently.

## Running the Script
Run the script in terminal using:
```sh
python autoOpen.py
```
The script will run continuously.

## Stopping the Script
To stop the script:
- Press `Ctrl + C` to stop execution.


## Possible Enhancements
- Browser URL detection is not working. It keeps opening new Homepages every loop.
- Improve UI design for the notification pop-up.


