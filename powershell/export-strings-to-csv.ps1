Get-ChildItem -recurse -include *.zs | foreach-object { 
    7z.exe e $_ > $null; 
    Write-Output "Extracted ZS $($_)" 
}; 
Get-ChildItem -recurse -include *.sarc | foreach-object { 
    SARCExtract.exe $_ > $null; 
    Write-Output "Extracted SARC $($_)"
}; 
Get-ChildItem -recurse -include *.sarc | remove-item; 
Write-Output "Removed SARC files"; 
MsbtEditor.exe $(get-location); 
Get-ChildItem -recurse -include *.msbt | remove-item; 
Write-Output "Removed MSBT"; 
Get-ChildItem -Recurse *.xmsbt | Rename-Item -newname { 
    $_.name -replace '.xmsbt','.xml' 
};
Write-Output "Renamed XMSBT to XML"; 
Get-ChildItem -Recurse -filter *.xml | foreach-object {
    $file = $_; $xml = [xml]::new(); 
    $xml.load($file.fullname); 
    $xml.xmsbt.ChildNodes | Export-Csv -Path ('{0}.csv' -f $file.fullname -replace '.xml','') -NoTypeInformation -Encoding UTF8 
}; Write-Output "Converted XML to CSV"; 
Get-ChildItem -recurse -include *.xml | remove-item; 
Write-Output "Removed XML files"; 
Get-ChildItem -Recurse -filter *.csv | foreach-object { 
    $file = $_; (Import-Csv $file.fullname) | Sort-Object label | Export-Csv $file.fullname -NoTypeInformation -Encoding UTF8 
}; Write-Output "Sorted CSV by label"; 
Write-Output "Done"