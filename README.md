# FloInput

CFX Post: https://forum.cfx.re/t/floinput-a-lightweight-fast-and-fun-input-system/

## Credits

This resource was partially created by [Eki](https://github.com/Ekinoxx0) for his own server.
I decided to remake everything from scratch and add some features.

## Implementation

If you want to integrate FloInput into your own server, you can submodule this repository into your `resources` folder and add the following line to your `server.cfg`:

```bash
git submodule add https://github.com/FRFlo/FloInput resources/FloInput
git submodule update --init --recursive
```

```cfg
ensure FloInput
```

## Installation

To install FloInput, simply run the following command:

```bash
npm run build
```

# InputProperties Class

The `InputProperties` class represents the properties of an input field. All properties are optional.

## Properties

- `minlength` (number): The minimum length of the input.
- `maxLength` (number): The maximum length of the input.
- `min` (number): The minimum value of the input.
- `max` (number): The maximum value of the input.
- `pattern` (string): The pattern to validate the input against.
- `placeholder` (string): The placeholder text of the input.
- `value` (string): The default value of the input.
- `secret` (boolean): Whether or not the input is a secret (password/passcode).

# FloInput Class

The `FloInput` class represents an NUI input dialog.

## Functions

### `FloInput.Create(title: string, inputType: string, inputProperties: InputProperties|nil, callback: function|nil): number`

Shows an NUI input dialog with the specified title, input type, and maximum length.

#### Parameters

- `title` (string): The title of the input dialog.
- `inputType` ("text"|"small_text"|"number"): The type of input. Can be "text", "small_text" or "number".
- `inputProperties` (InputProperties|nil): The properties of the input.
- `callback` (function|nil): The callback function to call after handling the response.

#### Returns

- `request` (number): The request number of the input.

### `FloInput.Hide()`

Hides the NUI input dialog.

#### Returns

- None

# Usage

```lua
-- Show a number input dialog
TriggerEvent('FloInput:create', 'Enter a number', 'number', {
    min = 0,
    max = 100,
    placeholder = 'Enter a number between 0 and 100',
    value = '50'
}, function(data)
    print('You entered: ' .. data)
end)

-- Show a text input dialog
TriggerEvent('FloInput:create', 'Enter a text', 'text', {
    minLength = 1,
    maxLength = 10,
    placeholder = 'Enter a text between 1 and 10 characters',
    value = 'Hello World!'
}, function(data)
    print('You entered: ' .. data)
end)

-- Show a small text input dialog
TriggerEvent('FloInput:create', 'Enter a small text', 'small_text', {
    minLength = 1,
    maxLength = 10,
    placeholder = 'Enter a small text between 1 and 10 characters',
    value = 'Hello World!'
}, function(data)
    print('You entered: ' .. data)
end)
```

```lua
-- Hide the input dialog
TriggerEvent('FloInput:hide')
```