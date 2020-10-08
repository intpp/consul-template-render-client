import React from 'react';

interface HeaderProps {
  version: string;
}

const Header = ({ version }: HeaderProps) => (
  <nav className="navbar navbar-dark bg-dark">
    <span className="navbar-brand">(HashiCorp Vault + Consul template) template render v{version}</span>
  </nav>
);

export default Header;
