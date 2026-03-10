import { storage } from "./storage";

export async function seedDatabase() {
  const existingItems = await storage.getRecoveryItems();
  if (existingItems.length === 0) {
    const defaultItems = [
      {
        name: "Windows 10 Recovery Environment (WinRE)",
        description: "Standard WinRE for Windows 10. Contains advanced startup options like Startup Repair, Command Prompt, and System Restore.",
        type: "wim",
        size: "350 MB",
        path: "repository/win10_re.wim",
        instructions: "1. Boot into Clonezilla-live grub\n2. Select 'Boot from network / PXE'\n3. Execute 'ocs_repository=\"http://server-ip/repository/win10_re.wim\"'\n4. Select the downloaded WIM in your computer's boot menu to bypass local BCD."
      },
      {
        name: "Windows 11 Setup / Full Image",
        description: "Full Windows 11 installation media. Used to reinstall Windows entirely or perform an in-place upgrade to fix severe corruption.",
        type: "folder",
        size: "5.2 GB",
        path: "repository/win11_setup/",
        instructions: "1. In Clonezilla shell, run 'mount -t cifs //server-ip/repository /mnt/repo'\n2. Copy the win11_setup folder to a clean partition\n3. Boot from that partition or execute setup.exe from WinPE."
      },
      {
        name: "BCD Rebuild Script",
        description: "Automated script to rebuild the Boot Configuration Data (BCD) store and fix EFI partition issues.",
        type: "script",
        size: "2 KB",
        path: "repository/scripts/rebuild_bcd.bat",
        instructions: "1. Boot into WinPE or any working Windows command prompt\n2. Map the network drive to the server\n3. Run 'rebuild_bcd.bat'\n4. The script will automatically scan for Windows installations and rebuild the BCD."
      },
      {
        name: "Emergency WinPE Minimal",
        description: "A very lightweight Windows Preinstallation Environment. Useful for accessing command prompt when disk space is extremely limited.",
        type: "winpe",
        size: "180 MB",
        path: "repository/winpe_minimal.iso",
        instructions: "1. Configure PXE boot in your BIOS/UEFI\n2. The server will provide this ISO via TFTP/HTTP\n3. Once booted, press F10 (or Shift+F10) to open command prompt."
      }
    ];

    for (const item of defaultItems) {
      await storage.createRecoveryItem(item);
    }
    console.log("Database seeded with default recovery items.");
  } else {
    console.log("Database already contains recovery items. Skipping seed.");
  }
}
