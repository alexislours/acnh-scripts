Get-ChildItem -Recurse -filter *.csv | foreach-object { 
    $file = $_; (Import-Csv $file.fullname) | Sort-Object label | Export-Csv $file.fullname -NoTypeInformation -Encoding UTF8 
}; 
Write-Output "Sorted CSV by label"; Write-Output "Done"