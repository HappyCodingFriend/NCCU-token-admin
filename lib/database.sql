CREATE SCHEMA `nccu_token` ;

CREATE TABLE `user` (
  `ID` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `address` char(42) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `friend` (
  `ID` varchar(45) NOT NULL,
  `friendID` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`,`friendID`),
  KEY `asd_idx` (`friendID`),
  CONSTRAINT `fID` FOREIGN KEY (`friendID`) REFERENCES `user` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order` (
  `autoID` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `point1` varchar(100) NOT NULL,
  `value1` varchar(100) NOT NULL,
  `point2` varchar(100) NOT NULL,
  `value2` varchar(100) NOT NULL,
  `buyer` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`autoID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

CREATE TABLE `point` (
  `address` varchar(45) NOT NULL,
  `unit` varchar(45) NOT NULL,
  `name` varchar(20) NOT NULL,
  `owner` varchar(65) NOT NULL,
  `deadline` datetime NOT NULL,
  `valid` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `transaction` (
  `txID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `ID` varchar(45) NOT NULL,
  `targetID` varchar(45) NOT NULL,
  `number` varchar(45) NOT NULL,
  `point` varchar(100) NOT NULL,
  `txHash` varchar(100) NOT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`txID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
