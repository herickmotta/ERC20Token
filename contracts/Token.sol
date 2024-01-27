// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract ERC20Token is IERC20 {
    address public owner;
    string public name;
    string public symbol;

    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address account => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event OwnershipTransfer(address indexed previousOwner, address indexed newOwner);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        mint(owner, _totalSupply);
    }

    function transfer(address to,uint256 value) external returns (bool success) {
        return _transferBalance(msg.sender, to, value);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool success) {
        _spendAllowance(msg.sender, from, value);
        return _transferBalance(from, to, value);
    }

    function _spendAllowance(address caller, address spender, uint256 amount) internal {
        require(allowance[caller][spender] >= amount, "Not enough allowance");
        allowance[caller][spender] -= amount;
    }

    function _transferBalance(address from, address to, uint256 value) internal returns (bool success) {
        if (from == address(0)) {
            totalSupply += value;
        }

        if (to == address(0)) {
            totalSupply -= value;
        }

        if (from != address(0) && to != address(0)) {
            require(balanceOf[from] >= value, "Not enough balance");
        }

        unchecked {
            balanceOf[from] -= value;
            balanceOf[to] += value;
        }

        emit Transfer(from, to, value);
        return true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
        emit OwnershipTransfer(owner, newOwner);
    }

    function renounceOwnership() public onlyOwner {
        owner = address(0);
        emit OwnershipTransfer(owner, address(0));
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _transferBalance(address(0), account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _transferBalance(account, address(0), amount);
    }
}