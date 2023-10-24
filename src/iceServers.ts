const iceServers = [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun1.voiceeclipse.net:3478" },
    { urls: "stun:relay.metered.ca:80" },
    {
      urls: "turn:relay.metered.ca:80",
      username: "your-turn-server-username",
      credential: "your-turn-server-password",
    },
    {
      urls: "turn:relay.metered.ca:443",
      username: "your-turn-server-username",
      credential: "your-turn-server-password",
    },
    {
      urls: [
        "turn:173.194.72.127:19305?transport=udp",
        "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
        "turn:173.194.72.127:443?transport=tcp",
        "turn:[2404:6800:4008:C01::7F]:443?transport=tcp",
      ],
      username: "CKjCuLwFEgahxNRjuTAYzc/s6OMT",
      credential: "u1SQDR/SQsPQIxXNWQT7czc/G4c=",
    },
    {
      urls: "turn:relay.metered.ca:443?transport=tcp",
      username: "your-turn-server-username",
      credential: "your-turn-server-password",
    },
  ];
  
  export default iceServers;