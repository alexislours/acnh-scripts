$acnhversion = Read-Host -Prompt 'ACNH Version'; 
mkdir .\RomFS\$($acnhversion); 
mkdir .\ExeFS\$($acnhversion); 
.\hactool -x --romfsdir RomFS\$($acnhversion) --exefsdir ExeFS\$($acnhversion) ".\$($acnhversion).nca" -t nca --onlyupdated --basenca ".\base.nca" --keyset=keys.ini