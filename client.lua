local currentRequest = 0
local inputCallbacks = {}
FloInput = {}

--- Checks if the specified value iss in the specified table.
--- @param tab table The table to check.
--- @param val any The value to check for.
--- @return boolean . Whether or not the value is in the table.
function Include(tab, val)
    for i = 1, #tab do
        if tab[i] == val then
            return true
        end
    end
    return false
end

--- Handles the response from the NUI input dialog.
--- @param data table The data object containing the response.
RegisterNUICallback('response', function(data)
    FloInput.Hide()

    -- Check if the response matches a stored request
    if inputCallbacks[data.request] ~= nil then
        -- Get the callback function for this input
        local callback = inputCallbacks[data.request]
        -- Call the callback function with the input value
        callback(data.value)
        -- Remove the callback function for this input
        inputCallbacks[data.request] = nil
    end
end)

--- Handles the allowmove from the NUI input dialog.
--- @param data table The state of the allowmove in a table.
RegisterNUICallback("allowmove", function(data)
    local state = data["allowmove"]
    SetNuiFocus(state, state)
end)

--- @class InputProperties
--- @field minlength number The minimum length of the input.
--- @field maxLength number The maximum length of the input.
--- @field min number The minimum value of the input.
--- @field max number The maximum value of the input.
--- @field pattern string The pattern to validate the input against.
--- @field placeholder string The placeholder text of the input.
--- @field value string The default value of the input.
--- @field secret boolean Whether or not the input is a secret (password/passcode).

--- Shows an NUI input dialog with the specified title, input type, and maximum length.
--- @param title string The title of the input dialog.
--- @param inputType "text"|"small_text"|"number" The type of input. Can be "text", "small_text" or "number".
--- @param inputProperties InputProperties|nil The properties of the input.
--- @param callback function|nil The callback function to call after handling the response.
--- @return number request The request number of the input.
FloInput.Create = function(title, inputType, inputProperties, callback)
    -- Validate the input parameters
    assert(type(title) == 'string', 'Invalid title specified. Must be a string.');
    assert(Include({ "text", "small_text", "number" }, inputType),
        'Invalid input type specified. Must be "text", "small_text" or "number".');

    inputProperties = inputProperties or {};

    assert(type(inputProperties) == 'table', 'Invalid input properties specified. Must be a table.');

    local validatedProperties = {}

    -- Properties and their expected types
    local validProperties = {
        minlength = "number",
        maxLength = "number",
        min = "number",
        max = "number",
        pattern = "string",
        placeholder = "string",
        value = "string",
        secret = "boolean",
    }

    -- Validate each property
    for property, propertyType in pairs(validProperties) do
        if inputProperties[property] ~= nil then
            if type(inputProperties[property]) == propertyType then
                validatedProperties[property] = inputProperties[property]
            end
        end
    end

    -- Increment the current request number
    currentRequest = currentRequest + 1

    -- Create the NUI input object
    local item = {
        show = true,
        request = currentRequest,
        type = inputType,
        title = title,
        minlength = validatedProperties.minlength,
        maxlength = validatedProperties.maxLength,
        min = validatedProperties.min,
        max = validatedProperties.max,
        pattern = validatedProperties.pattern,
        placeholder = validatedProperties.placeholder,
        value = validatedProperties.value,
        secret = validatedProperties.secret,
    }
    -- Send the NUI input object to the client-side NUI handler
    SendNUIMessage(item)
    -- Set focus to the NUI input
    SetNuiFocus(true, true)
    -- Store the callback function for this input
    inputCallbacks[currentRequest] = callback

    return currentRequest
end

--- Hides the NUI input dialog.
FloInput.Hide = function()
    -- Hide the NUI input dialog
    local item = {
        show = false,
    }
    -- Send the NUI input object to the client-side NUI handler
    SendNUIMessage(item)

    -- Wait for the NUI input to be hidden
    Citizen.Wait(0)

    -- Remove focus from the NUI input
    SetNuiFocus(false, false)
end

FloInput.Cancel = FloInput.Hide

RegisterNetEvent('FloInput:create', FloInput.Create)
RegisterNetEvent('FloInput:hide', FloInput.Hide)
RegisterNetEvent('FloInput:cancel', FloInput.Cancel)