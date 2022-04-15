# aegsc: Aegisub Script Compiler

A compiler for aegs files, which allow karaoke templates (and possibly other ASS-based formats) to be written in a nicely formatted way.
The compiler is available as a command line utility and as a Node library.

The aegs format used by this compiler is based on the format developed by [DCTewi][Aegisub-Helper] with a number of extensions.

[Aegisub-Helper]: https://github.com/DCTewi/Aegisub-Helper

## Installation

To install the command line utility:

```sh
npm install --global github:butterfansubs/aegsc
```

If you do not wish to install Node separately, binaries with a Node runtime bundled are available on the [Releases page][releases].
These can be run directly with no installation necessary.

[releases]: https://github.com/butterfansubs/aegsc/releases

To install the library as a dependency in a Node project:

```sh
npm install --save github:butterfansubs/aegsc
```

## Usage

### Command Line

The command line utility processes aegsc data from stdin and sends the compiled output to stdout.

The shell's redirect operators may be used to send input and output from and to files if desired:

```sh
aegsc < input.aegs > output.txt
```

No flags or arguments are recognized at this time.

The input can use Unix (LF) or DOS/Windows (CRLF) line endings.
The obsolete Classic Mac (CR) line endings are currently not supported.
The output uses the system's line endings.

### Library

The compiler may be imported as a CommonJS module:

```javascript
const { compile } = require('aegsc');

const output = compile(input);
```

The compiler is also available as an ES module:

```javascript
import { compile } from 'aegsc';

const output = compile(input);
```

Note that when used as a library, the input must be converted to use Unix (LF) line endings prior to being passed to the compiler.
In addition, Unix line endings are used in the output.

## The aegs format

The aegs format used by this compiler is described in the [`test/fixures/format-tutorial.aegs`][format-tutorial] file.
A real-world example can be found in the [`test/fixtures/real-world-example.aegs`][real-world-example] file.
The expected output for both files can be found in their respective `.out` files in the same directory.

[format-tutorial]: test/fixtures/format-tutorial.aegs
[real-world-example]: test/fixtures/real-world-example.aegs

Major extensions to DCTewi's original format include (but are not limited to):

- comments
- full customizability of ASS event fields
- proper Lua minification

## License

This project is licensed under the MIT license.
See the [LICENSE][] file for details.

[LICENSE]: ./LICENSE
