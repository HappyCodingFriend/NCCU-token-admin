pragma solidity ^0.4.23;

library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}


contract ERC20Interface {
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);
    function transfer(address to, uint tokens) public returns (bool success);
    function increaseApproval(address spender, uint tokens) public returns (bool success);
    function decreaseApproval(address spender, uint tokens) public returns (bool success);
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}


contract ApproveAndCallFallBack {
    function receiveApproval(address from, uint256 tokens, address token, bytes data) public;
}


// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}

contract FixedSupplyToken is ERC20Interface, Owned {
    using SafeMath for uint;

    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
    uint64 public deadline;
    bool public valid = true;
    

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(string _name, string _symbol, uint __totalSupply, uint64 _deadline) public {
        name = _name;
        symbol = _symbol;
        decimals = 0;
        _totalSupply = __totalSupply;
        balances[owner] = _totalSupply;
        deadline = _deadline;
        emit Transfer(address(0), owner, _totalSupply);
    }


    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public constant returns (uint) {
        return _totalSupply  - balances[address(0)];
    }


    // ------------------------------------------------------------------------
    // Get the token balance for account `tokenOwner`
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public constant returns (uint balance) {
        return balances[tokenOwner];
    }


    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to `to` account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        require(valid);
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces 
    // ------------------------------------------------------------------------
    function increaseApproval(address spender, uint tokens) public returns (bool success) {
        require(valid);
        allowed[msg.sender][spender] = allowed[msg.sender][spender].add(tokens);
        emit Approval(msg.sender, spender, allowed[msg.sender][spender]);
        return true;
    }
    function decreaseApproval(address spender, uint tokens) public returns (bool success) {
        require(valid);
        allowed[msg.sender][spender] = allowed[msg.sender][spender].sub(tokens);
        emit Approval(msg.sender, spender, allowed[msg.sender][spender]);
        return true;
    }

    // ------------------------------------------------------------------------
    // Transfer `tokens` from the `from` account to the `to` account
    // 
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the `from` account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        require(valid);
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }


    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }


    // ------------------------------------------------------------------------
    // Token owner can approve for `spender` to transferFrom(...) `tokens`
    // from the token owner's account. The `spender` contract function
    // `receiveApproval(...)` is then executed
    // ------------------------------------------------------------------------
    function approveAndCall(address spender, uint tokens, bytes data) public returns (bool success) {
        allowed[msg.sender][spender] = allowed[msg.sender][spender].add(tokens);
        emit Approval(msg.sender, spender, allowed[msg.sender][spender]);
        ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        return true;
    }


    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function () public payable {
        revert();
    }


    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
    
    //time
    function time(uint64 nowTime) onlyOwner public returns (bool success) {
        if(nowTime >= deadline){
            valid = false;
        }
        return true;
    }
    //recover
    function recover(uint64 newDeadline) onlyOwner public returns (bool success) {
        deadline = newDeadline;
        valid = true;
        return true;
    }
    //cancel
    function cancel() onlyOwner public returns (bool success) {
        valid = false;
        return true;
    }
    
}

contract Order is Owned{
    struct order{
        address owner;
        FixedSupplyToken sellToken;
        FixedSupplyToken buyToken;
        uint sellValue;
        uint buyValue;
    }
    
    mapping(bytes32 => order) orders;
    mapping(bytes32 => bool) valid;
    
    event AddOrderEvent(bytes32 _hash);
    event DeleteOrderEvent(bytes32 _hash);
    event TradeEvent(bytes32 _hash, address _buyer);
    event TradeError(bytes32 _hash, string _message);
    
    function addOrder(FixedSupplyToken _sellToken, FixedSupplyToken _buyToken, uint _sellValue, uint _buyValue, uint nonce) public returns (bool success) {
        bytes32 hash = keccak256(msg.sender, _sellToken, _buyToken, _sellValue, _buyValue, nonce);
        orders[hash] = order({
            owner: msg.sender,
            sellToken: _sellToken,
            buyToken: _buyToken,
            sellValue: _sellValue,
            buyValue: _buyValue
        });
        valid[hash] = true;
        emit AddOrderEvent(hash);
        return true;
    }
    
    function deleteOrder(bytes32 hash) public returns (bool success) {
        valid[hash] = false;
        emit DeleteOrderEvent(hash);
        return true;
    }
    
    function trade(bytes32 hash, address buyer) public returns (bool success) {
        address orderOwner = orders[hash].owner;
        FixedSupplyToken st = orders[hash].sellToken;
        FixedSupplyToken bt = orders[hash].buyToken;
        uint sv = orders[hash].sellValue;
        uint bv = orders[hash].buyValue;
        
        require(valid[hash],"Order is invalid.");
        require(st.allowance(orderOwner, owner) < sv || st.balanceOf(orderOwner) < sv, "Order's owner doesn't have enough token.");
        require(bt.allowance(orderOwner, owner) < bv || bt.balanceOf(orderOwner) < bv, "Buyer doesn't have enough token.");
        
        st.transferFrom(orderOwner, buyer, sv);
        bt.transferFrom(buyer, orderOwner, bv);
        emit TradeEvent(hash, buyer);
        return true;
    }
    function watchOrder(bytes32 hash) public view returns (address,FixedSupplyToken,FixedSupplyToken,uint,uint) {
        return (orders[hash].owner, orders[hash].sellToken, orders[hash].buyToken, orders[hash].sellValue, orders[hash].buyValue);
    } 
}
