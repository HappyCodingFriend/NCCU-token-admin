pragma solidity ^0.4.19;
 
contract SafeMath {
    uint256 constant public MAX_UINT256 =
    0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

    function safeAdd(uint256 x, uint256 y) pure internal returns (uint256 z) {
        require (x <= MAX_UINT256 - y);
        return x + y;
    }

    function safeSub(uint256 x, uint256 y) pure internal returns (uint256 z) {
        require (x >= y);
        return x - y;
    }

    function safeMul(uint256 x, uint256 y) pure internal returns (uint256 z) {
        if (y == 0) return 0;
        require (x <= MAX_UINT256 / y);
        return x * y;
    }
}

contract ContractReceiver {
    function tokenFallback(address _from, uint _value, bytes _data) public;
}
contract ERC223Token is SafeMath {
    
    event Transfer(address indexed _from, address indexed _to, uint256 _value, bytes _data);
    event Approval(address _third, uint _value);
    
    mapping(address => uint) approval;
    mapping(address => uint) balances;
    
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint64 public deadline;
    bool public valid = true;
    
    address owner;
    mapping(address => bool) auth;
    
    uint price = 0;
    
    function ERC223Token(string _name, string _symbol, uint8 _decimals, uint256 _totalSupply, uint64 _deadline) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        balances[msg.sender] = _totalSupply * (10 ** uint256(decimals));
        totalSupply = balances[msg.sender];
        deadline = _deadline;
        owner = msg.sender;
    }
    
    modifier isOwner(){
        if(owner == msg.sender)
            _;
    }
    modifier isAuth(){
        if(auth[msg.sender])
            _;
    }
    
    // Function to access name of token .
    function name() public constant returns (string _name) {
        return name;
    }
    // Function to access symbol of token .
    function symbol() public constant returns (string _symbol) {
        return symbol;
    }
    // Function to access decimals of token .
    function decimals() public constant returns (uint8 _decimals) {
        return decimals;
    }
    // Function to access total supply of tokens .
    function totalSupply() public constant returns (uint256 _totalSupply) {
        return totalSupply;
    }
    function valid() public constant returns (bool _valid) {
        return valid;
    }
    
    
    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint _value, bytes _data, string _custom_fallback) public returns (bool success) {
        require(valid);
        if(isContract(_to)) {
            require (balanceOf(msg.sender) >= _value);
            balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
            balances[_to] = safeAdd(balanceOf(_to), _value);
            assert(_to.call.value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
            Transfer(msg.sender, _to, _value, _data);
            return true;
        }
        else {
            return transferToAddress(_to, _value, _data);
        }
    }
    

    // Function that is called when a user or another contract wants to transfer funds .
    function transfer(address _to, uint _value, bytes _data) public returns (bool success) {
        require(valid);
        if(isContract(_to)) {
            return transferToContract(_to, _value, _data);
        }
        else {
            return transferToAddress(_to, _value, _data);
        }
    }
    
    // Standard function transfer similar to ERC20 transfer with no _data .
    // Added due to backwards compatibility reasons .
    function transfer(address _to, uint _value) public returns (bool success) {
        require(valid);
        //standard function transfer similar to ERC20 transfer with no _data
        //added due to backwards compatibility reasons
        bytes memory empty;
        if(isContract(_to)) {
            return transferToContract(_to, _value, empty);
        }
        else {
            return transferToAddress(_to, _value, empty);
        }
    }

    //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
    function isContract(address _addr) private view returns (bool is_contract) {
        uint length;
        assembly {
                //retrieve the size of the code on target address, this needs assembly
                length := extcodesize(_addr)
        }
        return (length>0);
    }

    //function that is called when transaction target is an address
    function transferToAddress(address _to, uint _value, bytes _data) private returns (bool success) {
        require (balanceOf(msg.sender) >= _value);
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    
    //function that is called when transaction target is a contract
    function transferToContract(address _to, uint _value, bytes _data) private returns (bool success) {
        require (balanceOf(msg.sender) >= _value);
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        ContractReceiver receiver = ContractReceiver(_to);
        receiver.tokenFallback(msg.sender, _value, _data);
        Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    
    function transferFromAtoB(address _from, address _to, uint _value) isOwner public returns (bool success) {
        require(balanceOf(_from) >= _value);
        bytes memory empty;
        balances[_from] = safeSub(balanceOf(_from), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        Transfer(_from, _to, _value, empty);
        return true;
    }
    function transferFromAuth(address _to, uint _value) isAuth public returns (bool success) {
        require(approval[msg.sender] >= _value);
        bytes memory empty;
        balances[owner] = safeSub(balanceOf(owner), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        Transfer(owner, _to, _value, empty);
        return true;
    }
    
    function approve(address _third, uint _value) isOwner public {
        if(!auth[_third]){
            auth[_third] = true;
        }
        approval[_third] = _value;
    }
    
    function time(uint64 _now) isOwner public {
        if(_now >= deadline){
            valid = false;
        }
    }

    function balanceOf(address _owner) public constant returns (uint balance) {
        return balances[_owner];
    }
    
    function addExchange(ERC223Token t, uint a1, uint a2, uint64 _deadline) public {
        require(balanceOf(msg.sender) >= a1);
        bytes memory _empty;
        Exchange ex = new Exchange(msg.sender, this, t, a1, a2,  _deadline);
        transferToAddress(ex, a1, _empty);
    }
}

contract Exchange is ContractReceiver{
    
    address owner;
    ERC223Token t1;
    ERC223Token t2;
    uint a1;
    uint a2;
    uint64 deadline;
    bool valid;
    
    event addExchangeEvent(address from);
    event doExchangeEvent(address from);
    event cancelExchangeEvent(address addr);
    
    function Exchange(address _owner, ERC223Token _t1, ERC223Token _t2, uint _a1, uint _a2, uint64 _deadline) public {
        owner = _owner;
        t1 = _t1;
        t2 = _t2;
        a1 = _a1;
        a2 = _a2;
        deadline = _deadline;
        valid = true;
        addExchangeEvent(_owner);
    }
    function getT1() public constant returns(ERC223Token){
        return t1;
    }
    function getT2() public constant returns(ERC223Token){
        return t2;
    }
    function getA1() public constant returns(uint){
        return a1;
    }
    function getA2() public constant returns(uint){
        return a2;
    }
    function getOwner() public constant returns(address){
        return owner;
    }
    function getDeadline() public constant returns(uint64){
        return deadline;
    }
    function tokenFallback(address _from, uint _value, bytes _data) public {
        require(_value == a2 && valid);
        doExchangeEvent(_from);
        t1.transfer(_from, a1);
        t2.transfer(owner, _value);
        valid = false;
    }
    function cancel() public {
        require(owner == msg.sender);
        t1.transfer(owner, a1);
        valid = false;
        cancelExchangeEvent(this);
    }
    function time(uint64 _time) public {
        if(_time >= deadline){
            cancel();
        }
    }
}