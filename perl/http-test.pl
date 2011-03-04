#!/usr/bin/perl -w

use IO::Socket;
my $sock = new IO::Socket::INET (
                                 LocalHost => 'localhost',
                                 LocalPort => '8000',
                                 Proto => 'tcp',
                                 Listen => 1,
                                 Reuse => 1,
                                );
die "Could not create socket: $!\n" unless $sock;
             

$new_sock = $sock->accept();
while(<$new_sock>) {
  # print "Content-Type: text/plain\n\n";
  print $_;
}
close($sock);
