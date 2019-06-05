# i18n translation builder

## What is it?

Sometimes it's already really long to build your entire page and you don't want to waste anymore time building your translation files.

Now, the only thing you have to do is call the i18n translation builder command with the your file's path and the translations folder's path:

`i18n-build ./myFile.Vue ./lang`

This command will generate all the translations files required for the file you entered as first parameter!

## How can I use it?

First of all, install the extension using:

`npm i -g i18n-build`

(don't forget the `-g`!)

Now you can execute the `i18n-build` command from anywhere!

Here's the full command format::

`i18n-build [file-path] [folder-path] [...files-names]`

### file-names parameter and auto-detection

The last parameter (file-names) is optional, and only acts as an helper to make the difference between what's really a translation from what's not.  

The current auto-detection system is based on 4 checks:
- the chain between single quotes contains dots
- the part of the chain before the the first dot is not empty
- the path formed with the folder provided by the user and the chain before the first dot is valid
- the chain before the first dot is contained inside the file-names provided by the user *(only if the last parameter has been provided)*

## Future releases

There is still a lot of room for improvement. If you have any propositions, let me know on the [github repository of this project](https://github.com/ChriisX/i18n-translation-builder).

From my point of view, here is what can (and will) be improved / added:

### Better detection

Also accept double quotes and other kinds of separators.

### Other languages

For now, the generated file is based on Laravel's way of handling translations. There are way more languages and frameworks than that, it's only the beginning of a whole translation automation journey!