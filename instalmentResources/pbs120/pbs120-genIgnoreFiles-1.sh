#! /bin/bash -x

uuidgen > ignoreFile1.tmp
uuidgen > contrib/ignoreFile2.tmp
mkdir ignoreDir
uuidgen > ignoreDir/ignoreFile3.txt
uuidgen > ignoreDir/ignoreFile4.txt