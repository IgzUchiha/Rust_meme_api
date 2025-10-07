// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title MemeRewards
 * @dev Manages ETH rewards for meme creators with batch claiming via Merkle proofs
 */
contract MemeRewards is ReentrancyGuard, Ownable {
    // Reward amount per like (in wei)
    uint256 public rewardPerLike = 0.001 ether;
    
    // Merkle root for batch claims
    bytes32 public merkleRoot;
    
    // Track claimed rewards to prevent double-claiming
    mapping(address => uint256) public claimedRewards;
    
    // Track pending rewards (off-chain aggregation)
    mapping(address => uint256) public pendingRewards;
    
    // Events
    event LikeRewardDeposited(address indexed creator, uint256 amount, uint256 memeId);
    event RewardsClaimed(address indexed creator, uint256 amount);
    event MerkleRootUpdated(bytes32 newRoot);
    event RewardPerLikeUpdated(uint256 newAmount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Deposit reward for a like
     * @param creator Address of the meme creator
     * @param memeId ID of the meme being liked
     */
    function depositLikeReward(address creator, uint256 memeId) external payable {
        require(msg.value >= rewardPerLike, "Insufficient reward amount");
        require(creator != address(0), "Invalid creator address");
        
        pendingRewards[creator] += msg.value;
        
        emit LikeRewardDeposited(creator, msg.value, memeId);
    }
    
    /**
     * @dev Claim rewards using Merkle proof (batch claiming)
     * @param totalAmount Total amount claimable by the user
     * @param merkleProof Merkle proof for verification
     */
    function claimRewards(
        uint256 totalAmount,
        bytes32[] calldata merkleProof
    ) external nonReentrant {
        require(totalAmount > 0, "No rewards to claim");
        
        // Calculate amount to claim (total - already claimed)
        uint256 alreadyClaimed = claimedRewards[msg.sender];
        require(totalAmount > alreadyClaimed, "Already claimed all rewards");
        uint256 amountToClaim = totalAmount - alreadyClaimed;
        
        // Verify Merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, totalAmount));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, leaf),
            "Invalid Merkle proof"
        );
        
        // Update claimed amount
        claimedRewards[msg.sender] = totalAmount;
        
        // Transfer rewards
        (bool success, ) = msg.sender.call{value: amountToClaim}("");
        require(success, "Transfer failed");
        
        emit RewardsClaimed(msg.sender, amountToClaim);
    }
    
    /**
     * @dev Simple claim without Merkle proof (uses pendingRewards mapping)
     */
    function claimPendingRewards() external nonReentrant {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No pending rewards");
        
        pendingRewards[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardsClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Update Merkle root (admin only)
     * @param newRoot New Merkle root
     */
    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        merkleRoot = newRoot;
        emit MerkleRootUpdated(newRoot);
    }
    
    /**
     * @dev Update reward per like (admin only)
     * @param newAmount New reward amount in wei
     */
    function updateRewardPerLike(uint256 newAmount) external onlyOwner {
        rewardPerLike = newAmount;
        emit RewardPerLikeUpdated(newAmount);
    }
    
    /**
     * @dev Get pending rewards for an address
     */
    function getPendingRewards(address user) external view returns (uint256) {
        return pendingRewards[user];
    }
    
    /**
     * @dev Get claimed rewards for an address
     */
    function getClaimedRewards(address user) external view returns (uint256) {
        return claimedRewards[user];
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
