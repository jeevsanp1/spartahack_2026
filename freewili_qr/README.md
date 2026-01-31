# Free Wili QR Code Setup

This folder contains the code to display a QR code on your Free Wili device.

## Prerequisites

1.  **Free Wili Device**: You must have a Free Wili device.
2.  **CircuitPython**: Ensure your device is running CircuitPython. When plugged in, it should appear as a USB drive named `CIRCUITPY` (or `FREEWILI` depending on the bootloader).
3.  **Libraries**: You need the CircuitPython library bundle.

## Step 1: Install Libraries

You need to copy the required libraries to the `lib` folder on your device's USB drive.

1.  Download the **CircuitPython Library Bundle** (version 9.x or matching your CP version) from [circuitpython.org/libraries](https://circuitpython.org/libraries).
2.  Extract the bundle.
3.  Copy the following folders/files from the bundle's `lib` folder to the `lib` folder on your **CIRCUITPY** drive:
    *   `adafruit_miniqr.mpy` (or the folder `adafruit_miniqr`)
    *   `adafruit_display_text` (folder)

## Step 2: Upload Code

1.  Copy the `code.py` file from this folder to the root of your **CIRCUITPY** drive.
2.  It should replace the existing `code.py`.

## Step 3: Run

The device should automatically soft-reload and run the script. You should see a QR code on the display!

## Customizing

Open `code.py` and change the `QR_DATA` variable to the URL or text you want to encode.

```python
QR_DATA = "https://your-custom-url.com"
```
