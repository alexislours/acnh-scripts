#!/usr/bin/python3

import os
import re
import shutil
import sys

blacklist = [
    # "STR_Common",
    "STR_FixedForm",
    # "STR_Favorite",
    # "STR_Mailcheck",
    # "STR_Nickname"
]

currentDir = os.getcwd()
outputDir = currentDir + "/script_output/"
print(os.getcwd())

translationPrefix = r"&#xE;[2\(\)](\\0|[%'])&#x4;(&#x[1-5];|\\0)?[촀촁](\\0)?"
# prefix1 = r"&#xE;2\\0&#x4;&#x[12];촀"
# prefix2 = r"&#xE;2&#x3;촀"
# prefix3 = r"&#xE;(\\0&#x4;촁\\0"

emptyArg = r"\\0"
oneLetterArg = r"&#x2;.{1}"
twoLetterArg = r"&#x4;.{2}"
threeLetterArg = r"&#x6;.{3}"
fourLetterArg = r"&#x8;.{4}"
fifeLetterArg = r"\\n.{5}" # &#x10; sequence is not presented in CSV
sixLetterArg = r"&#xC;.{6}" # STR_Favorite 183
anyArg = f"{emptyArg}|{oneLetterArg}|{twoLetterArg}|{threeLetterArg}|{fourLetterArg}|{fifeLetterArg}|{sixLetterArg}"

declensionFuncPrefix = r"&#xE;2&#x16;"
declensionFunc = r"(&#x\w{1,2};|[\(&$ ]|\"\")"
declensionFuncCall = fr"{declensionFuncPrefix}\(?{declensionFunc}({anyArg})({anyArg})({anyArg})({anyArg})?"

genderFunc = r"&#xE;2&#x6;&#x\w{1,2};"
genderFuncCall = f"{genderFunc}({anyArg})({anyArg})"

getUserNameFunc = "&#xE;2&#x17;&#x2;촃&#xE;n&#x1E;" # used in STR_ItemName_80_Etc
getCharacterNameFunc = "&#xE;Z&#x1B;" # used in STR_Book
otherFuncs = f" ({getUserNameFunc}|{getCharacterNameFunc})"


def rawArgument(fullArg):
    if fullArg == r"\0": return ""
    if fullArg[:2] == r"\n": return fullArg[-5:]

    argType = re.search(r".+?;", fullArg).group(0)
    if argType == "&#x2;": return fullArg[-1:]
    if argType == "&#x4;": return fullArg[-2:]
    if argType == "&#x6;": return fullArg[-3:]
    if argType == "&#x8;": return fullArg[-4:]
    if argType == "&#xC;": return fullArg[-6:]
    return ""

def firstGroup(matchobj):
    fullArg = matchobj.group(1)
    return rawArgument(fullArg)

def secondGroup(matchobj):
    fullArg = matchobj.group(2)
    return rawArgument(fullArg)

def combinedGenders(matchobj):
    return f"{firstGroup(matchobj)}(-{secondGroup(matchobj)})"


def normalize(line):
    line = re.sub(translationPrefix, "", line)
    line = re.sub(declensionFuncCall, secondGroup, line)
    line = re.sub(genderFuncCall, combinedGenders, line)
    line = re.sub(getUserNameFunc, "%username%", line)
    line = re.sub(getCharacterNameFunc, "%character_name%", line)
    line = re.sub(otherFuncs, "", line)
    return line

def clearOldFiles():
    shutil.rmtree(outputDir, ignore_errors=True, onerror=None)
    os.mkdir(outputDir)

def scanDir():
    with os.scandir() as it:
        for entry in it:
            fileName, fileExtension = os.path.splitext(entry.name)
            if fileExtension == '.csv' and fileName not in blacklist:
                with open(entry) as sourceFile, open(outputDir + entry.name, 'w') as outputFile:
                    for line in sourceFile.readlines():
                        normalizedStr = normalize(line)
                        outputFile.write(normalizedStr + "\n")
                        # if '#' in normalizedStr:
                        #     print(f"String parsing failed in {fileName}:\n{line}")

if len(sys.argv) > 1:
    print(normalize(sys.argv[1]))
else:
    clearOldFiles()
    scanDir()
