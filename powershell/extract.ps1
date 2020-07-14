$acnhversion = Read-Host -Prompt 'ACNH Version'; 
mkdir .\RomFS\$($acnhversion); 
mkdir .\ExeFS\$($acnhversion); 
mkdir .\RomFS\$($acnhversion)-full; 
mkdir .\ExeFS\$($acnhversion)-full; 
.\hactool -x --romfsdir RomFS\$($acnhversion)-full --exefsdir ExeFS\$($acnhversion)-full ".\$($acnhversion).nca" -t nca --basenca ".\base.nca" --keyset=keys.ini; 
.\hactool -x --romfsdir RomFS\$($acnhversion) --exefsdir ExeFS\$($acnhversion) ".\$($acnhversion).nca" -t nca --onlyupdated --basenca ".\base.nca" --keyset=keys.ini