
import board
import displayio
import terminalio
from adafruit_display_text import label
import adafruit_miniqr

def main():
    # Attempt to initialize the display.
    # On Free Wili, the display is usually initialized by board.DISPLAY
    try:
        display = board.DISPLAY
    except AttributeError:
        # Fallback or specific freewili library might be needed if board.DISPLAY isn't present
        # But generally Free Wili CircuitPython builds have it.
        print("board.DISPLAY not found. Ensure you have the correct CircuitPython build.")
        return

    # Data for the QR code
    # TODO: Change this URL to whatever you want to link to!
    QR_DATA = "https://spartahack.com"

    # Generate the QR code
    qr = adafruit_miniqr.QRCode(qr_type=3, error_correct=adafruit_miniqr.ERROR_CORRECT_L)
    qr.add_data(QR_DATA.encode("utf-8"))
    qr.make()

    # Create the bitmap for the QR code
    # One pixel per module, we will scale it up
    qr_bitmap = displayio.Bitmap(qr.matrix.width, qr.matrix.height, 2)
    palette = displayio.Palette(2)
    palette[0] = 0xFFFFFF  # White background
    palette[1] = 0x000000  # Black data pixels

    # Fill the bitmap
    for y in range(qr.matrix.height):
        for x in range(qr.matrix.width):
            if qr.matrix[x, y]:
                qr_bitmap[x, y] = 1
            else:
                qr_bitmap[x, y] = 0

    # Calculate scale to fit on screen
    # 320x240 screen
    scale = min(display.width // qr.matrix.width, display.height // qr.matrix.height)
    
    # Create a TileGrid to hold the bitmap
    qr_grid = displayio.TileGrid(qr_bitmap, pixel_shader=palette)

    # Create a Group to hold the TileGrid and center it
    group = displayio.Group(scale=scale)
    
    # Center the QR code
    qr_grid.x = (display.width // scale - qr.matrix.width) // 2
    qr_grid.y = (display.height // scale - qr.matrix.height) // 2
    
    group.append(qr_grid)

    # Optional: Add text label
    text_group = displayio.Group(scale=2, x=0, y=10)
    text = "Scan Me!"
    text_area = label.Label(terminalio.FONT, text=text, color=0xFFFFFF)
    text_area.x = (display.width // 2) - (text_area.width // 1) # simple centering attempt
    text_group.append(text_area)
    
    # Combined group
    main_group = displayio.Group()
    main_group.append(group)
    # main_group.append(text_group) # Uncomment to add text if desired

    # Show the group
    display.root_group = main_group

    while True:
        pass

if __name__ == "__main__":
    main()
