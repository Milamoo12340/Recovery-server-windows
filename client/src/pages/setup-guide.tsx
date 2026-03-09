import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shell, AlertCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface ServerInfo {
  serverUrl: string;
  serverIp: string;
  port: number;
}

export function SetupGuide() {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pxe: false,
    clonezilla: false,
    winpe: false,
  });
  const [copiedText, setCopiedText] = useState('');

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await fetch('/api/server-info');
        const data = await response.json();
        setServerInfo(data);
      } catch (error) {
        console.error('Failed to fetch server info:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServerInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading server information...</div>;
  }

  if (!serverInfo) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load server information</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Remote Recovery Setup Guide</h1>
        <p className="text-muted-foreground">
          Follow the steps below to connect your computer to this recovery server
        </p>
      </div>

      {/* Server Connection Info */}
      <Card className="bg-card border-card-border p-6 space-y-4">
        <h2 className="text-xl font-semibold">Your Server Information</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Save this information - you'll need it to connect your computer to this recovery server
          </AlertDescription>
        </Alert>

        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Server URL</div>
              <div>{serverInfo.serverUrl}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(serverInfo.serverUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Server IP Address</div>
              <div>{serverInfo.serverIp}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(serverInfo.serverIp)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Port</div>
              <div>{serverInfo.port}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard(String(serverInfo.port))}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* PXE Boot Section */}
      <Card className="bg-card border-card-border p-6">
        <button
          onClick={() => toggleSection('pxe')}
          className="w-full flex items-center justify-between hover-elevate p-3 rounded-md"
        >
          <div className="flex items-center gap-3 text-left">
            <Shell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Option 1: PXE Boot (Network Boot)</h3>
              <p className="text-sm text-muted-foreground">For computers with network boot capability</p>
            </div>
          </div>
          {expandedSections.pxe ? <ChevronUp /> : <ChevronDown />}
        </button>

        {expandedSections.pxe && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What is PXE Boot?</h4>
              <p className="text-sm text-muted-foreground">
                PXE (Preboot eXecution Environment) allows your computer to boot from the network
                instead of its hard drive. This is useful when your hard drive won't start.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Step 1: Enter BIOS/UEFI</h4>
                <Alert variant="default">
                  <AlertDescription>
                    Restart your computer and press <code className="bg-muted px-2 py-1 rounded">F2</code>,{' '}
                    <code className="bg-muted px-2 py-1 rounded">F10</code>, <code className="bg-muted px-2 py-1 rounded">Del</code>, or{' '}
                    <code className="bg-muted px-2 py-1 rounded">Esc</code> (depends on your computer brand)
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Step 2: Enable Network Boot</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Look for "Network Boot", "PXE", or "LAN Boot" option and enable it
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Step 3: Configure Network Settings (if required)</h4>
                <div className="space-y-2 text-sm font-mono bg-muted p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <code>Server IP: {serverInfo.serverIp}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(serverInfo.serverIp)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <code>Port: {serverInfo.port}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(String(serverInfo.port))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Use DHCP (automatic) if available. Otherwise, manually enter the IP address above
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Clonezilla Section */}
      <Card className="bg-card border-card-border p-6">
        <button
          onClick={() => toggleSection('clonezilla')}
          className="w-full flex items-center justify-between hover-elevate p-3 rounded-md"
        >
          <div className="flex items-center gap-3 text-left">
            <Shell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Option 2: Clonezilla Live</h3>
              <p className="text-sm text-muted-foreground">For computers that can boot from USB/CD</p>
            </div>
          </div>
          {expandedSections.clonezilla ? <ChevronUp /> : <ChevronDown />}
        </button>

        {expandedSections.clonezilla && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What is Clonezilla Live?</h4>
              <p className="text-sm text-muted-foreground">
                Clonezilla is a free disk cloning tool that boots from a USB drive or CD. It can access
                recovery files from your network server without needing Windows to be running.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Step 1: Boot from USB/CD</h4>
                <Alert variant="default">
                  <AlertDescription>
                    Restart your computer and press <code className="bg-muted px-2 py-1 rounded">F12</code> or{' '}
                    <code className="bg-muted px-2 py-1 rounded">ESC</code> to enter the boot menu,
                    then select your USB drive or CD
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Step 2: Once in Clonezilla Shell</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You'll see a command prompt. Use the following commands to connect to this server
                  and access recovery files:
                </p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To configure network with DHCP:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm">
                      <code>dhclient eth0</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard('dhclient eth0')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To mount the repository:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm break-all">
                      <code>mount -t cifs //{serverInfo.serverIp}/repository /mnt/repo</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`mount -t cifs //${serverInfo.serverIp}/repository /mnt/repo`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">To set OCS repository path:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm break-all">
                      <code>export ocs_repository="http://{serverInfo.serverIp}:{serverInfo.port}/repository"</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`export ocs_repository="http://${serverInfo.serverIp}:${serverInfo.port}/repository"`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  💡 <strong>Tip:</strong> You can copy these commands and paste them into the terminal.
                  Right-click to paste, or use Shift+Insert on some systems.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* WinPE Section */}
      <Card className="bg-card border-card-border p-6">
        <button
          onClick={() => toggleSection('winpe')}
          className="w-full flex items-center justify-between hover-elevate p-3 rounded-md"
        >
          <div className="flex items-center gap-3 text-left">
            <Shell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Option 3: Windows PE (WinPE)</h3>
              <p className="text-sm text-muted-foreground">For accessing Windows recovery tools</p>
            </div>
          </div>
          {expandedSections.winpe ? <ChevronUp /> : <ChevronDown />}
        </button>

        {expandedSections.winpe && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">What is Windows PE?</h4>
              <p className="text-sm text-muted-foreground">
                Windows PE is a minimal version of Windows that boots from USB or CD. It gives you
                access to Windows command tools and recovery utilities, even if Windows won't start normally.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">Step 1: Boot from WinPE USB/CD</h4>
                <Alert variant="default">
                  <AlertDescription>
                    Download WinPE from this recovery server (check the Recovery Items section),
                    write it to a USB drive, then boot from it
                  </AlertDescription>
                </Alert>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Step 2: Once WinPE has Started</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Press <code className="bg-muted px-2 py-1 rounded">F10</code> or{' '}
                  <code className="bg-muted px-2 py-1 rounded">Shift+F10</code> to open a command prompt
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Step 3: Connect to the Recovery Server</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Configure network settings:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm">
                      <code>ipconfig /all</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard('ipconfig /all')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Map network drive to recovery server:</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm break-all">
                      <code>net use z: \\{serverInfo.serverIp}\repository</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`net use z: \\\\${serverInfo.serverIp}\\repository`)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Run BCD repair script (if available):</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-md font-mono text-sm">
                      <code>z:\scripts\rebuild_bcd.bat</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard('z:\\scripts\\rebuild_bcd.bat')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  💡 <strong>Tip:</strong> Once mapped, you can access recovery files from Z: drive
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Troubleshooting Tips */}
      <Card className="bg-card border-card-border p-6">
        <h3 className="font-semibold mb-4">Need Help?</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-1">Can't connect to the server?</p>
            <p className="text-muted-foreground">
              Make sure your computer is on the same network. Check the IP address is correct and that
              you can ping the server: <code className="bg-muted px-2 py-1 rounded">ping {serverInfo.serverIp}</code>
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">Passwords or authentication?</p>
            <p className="text-muted-foreground">
              Some network connections may require credentials. Check with your network administrator or
              the recovery server setup for any required username/password.
            </p>
          </div>

          <div>
            <p className="font-semibold mb-1">Still having trouble?</p>
            <p className="text-muted-foreground">
              Try the AI Chat Assistant - it can help troubleshoot specific boot errors and recovery issues
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
