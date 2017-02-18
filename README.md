# Craftix CLI

Command-line utility for craftix projects

## Installing

**Note : You need to be admin**

```bash
npm install -g craftix-cli
```

**Then restart the terminal (or even the computer if it does not work)**

## Creating a project

```bash
craftix init
```

This will create an empty project using [this template](https://github.com/craftix/template), downloads the dependencies, etc...

**Don't forget to fill craftix.json then, see [the doc](https://craftix.github.io/Creating_A_Project)**

## Testing (running)

```bash
craftix run
```

This will launches your launcher and a craftix server

## Exporting

### Jar

```bash
craftix build jar
```

This will create **output/[Name].jar**

### Windows (.exe)

```bash
craftix build win
```

This will create **output/[Name].exe**, **output/[Name].jar**, and **output/launch4j-[Name].xml**

### Mac (.app)

```bash
craftix build mac
```

This will create **output/[Name].app**, **output/[Name].app.zip**, **output/[Name].jar**, and **output/sharkbundler-[Name].sbp**

