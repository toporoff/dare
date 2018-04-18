# DARE

DARE : Decentralised Autonomous Reward Ecosystem


   1) Greyhat applies working payload (0-day etc.) to smart-contrat
   2) Sandbox node PoC tests metasploit or other payload against given target
   3) If automatic test succeeds, payload will be sent to one of the curator for manual approval
   4) Once Curator receives the payload, he will manually check/confirm the exploit,
      report it to global Antivirus databases, and reward the Greyhat

  Model Challenges: Spam attacks (requests, node process corruption), corrupt curator

  Spam attack solutions:                             
                             
                             * Expensive apply method
                             * Greyhat "kyc"

  Token anonymity solutions: 
  
                             * Enigma Secret Contracts
                             * zkSNARKS
                             * cross-chain XMR/ZCASH

  Further improvements:                                
                             
                             * Private messaging
                             * Secure state channel
                             * Node sandbox vm's consensus (full decentralisation)
                             * Possibility to exclude human curator (node consensus, AI)

Timeline
    
     Q1 2018, MVP  = working base with apply + sandboxCheck + curatorCheck + Reward
                      Everything is publicly available though,
                      and does not have any sort of privacy
                      or real decentralised consensus, yet

     Q1 2018, team expansion
     Q2 2018, privacy/state channel solution
     Q3 2018, Sandbox node consensus, decentralisation
     Q4 2018, cross-chain, anonymity upgrade, secret contract implementation
     Q1 2019, PR, Marketing, Partnerships, Expand community x-fold


![alt text](https://github.com/block-shaman/dar/raw/master/DARE.Diagram.png)