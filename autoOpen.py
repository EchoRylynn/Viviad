import time
import webbrowser
import psutil
import pygetwindow as gw
import ctypes
import tkinter as tk

# Configuration
URL = "http://127.0.0.1:5500/pre-index.html"  
INACTIVITY_THRESHOLD = 10  # 10 seconds
NOTIFICATION_COUNTDOWN = 15  # 15 seconds countdown before opening URL
BROWSER_PROCESS_NAMES = ["chrome", "firefox", "msedge"]  # Add other browser names if needed

# Global variables
last_opened_time = 0
user_action = None  # Tracks user decision

# Windows-specific inactivity detection
def get_last_input_time():
    """Get the time (in seconds) since the last user input."""
    class LASTINPUTINFO(ctypes.Structure):
        _fields_ = [("cbSize", ctypes.c_uint), ("dwTime", ctypes.c_uint)]

    last_input_info = LASTINPUTINFO()
    last_input_info.cbSize = ctypes.sizeof(LASTINPUTINFO)
    ctypes.windll.user32.GetLastInputInfo(ctypes.byref(last_input_info))
    millis_since_last_input = ctypes.windll.kernel32.GetTickCount() - last_input_info.dwTime
    return millis_since_last_input / 1000.0

def is_system_inactive(threshold):
    """Check if the system has been inactive for the specified threshold."""
    last_input_time = get_last_input_time()
    print(f"Last input time: {last_input_time} seconds (Threshold: {threshold} seconds)")
    return last_input_time > threshold

def is_browser_with_url_open(target_url):
    """Check if a browser has a window open with the given URL."""
    target_url = target_url.replace("http://", "").replace("https://", "").rstrip("/")  # Normalize URL

    for window in gw.getWindowsWithTitle(""):
        title = window.title.strip()
        if title:
            print(f"Checking window title: {title}")  # Debugging: See what titles are found
            if target_url in title:  # Look for partial URL match in title
                return True
    return False

def show_notification(url, countdown):
    """Show a pop-up notification with a countdown before opening the URL."""
    global user_action
    user_action = None  # Reset user action

    def update_countdown():
        nonlocal countdown
        if countdown > 0 and user_action is None:
            label.config(text=f"Opening in {countdown} seconds...")
            countdown -= 1
            root.after(1000, update_countdown)
        elif user_action is None:  # If no action taken, open URL
            root.destroy()
            webbrowser.open(url)
            print(f"Opened URL: {url}")

    def stay():
        """User clicks 'Stay' → Cancel URL opening."""
        global user_action
        user_action = "stay"
        root.destroy()
        print("User chose to stay. URL will NOT open.")

    def back():
        """User clicks 'Back' → Open URL immediately."""
        global user_action
        user_action = "back"
        root.destroy()
        webbrowser.open(url)
        print(f"User chose to go back. URL opened: {url}")

    # Create pop-up window
    root = tk.Tk()
    root.title("Inactivity Alert")
    root.geometry("350x150")
    root.resizable(False, False)

    label = tk.Label(root, text=f"Opening in {countdown} seconds...", font=("Arial", 12))
    label.pack(pady=10)

    button_frame = tk.Frame(root)
    button_frame.pack(pady=10)

    stay_button = tk.Button(button_frame, text="Stay", command=stay, width=10)
    stay_button.grid(row=0, column=0, padx=5)

    back_button = tk.Button(button_frame, text="Back", command=back, width=10)
    back_button.grid(row=0, column=1, padx=5)

    root.after(1000, update_countdown)  # Start countdown
    root.mainloop()

def open_url_if_inactive(url, inactivity_threshold):
    """Open the URL if the system is inactive and the URL is not already open."""
    global last_opened_time

    if is_system_inactive(inactivity_threshold):
        if not is_browser_with_url_open(url):
            current_time = time.time()
            if current_time - last_opened_time > inactivity_threshold:  # Cooldown period
                show_notification(url, NOTIFICATION_COUNTDOWN)  # Show pop-up
                last_opened_time = current_time
            else:
                print(f"Cooldown active. Skipping URL open.")
        else:
            print(f"URL '{url}' is already open.")
    else:
        print("System is active or URL is already open.")

# Main loop
if __name__ == "__main__":
    while True:
        open_url_if_inactive(URL, INACTIVITY_THRESHOLD)
        time.sleep(1800)  # Check every 30mins
