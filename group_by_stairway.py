#!/usr/bin/env python3
"""
Jakokirjan tilausten ryhmittely rappukohtaisesti
(Group distribution list orders by stairway)

This script processes CSV files containing delivery orders and groups them
by building stairways (rappu) for easier distribution in apartment buildings.
"""

import csv
import re
import sys
from collections import defaultdict
from typing import Dict, List, Tuple, Optional


def parse_address(address: str) -> Tuple[str, Optional[str]]:
    """
    Parse address to extract base address and stairway letter.
    
    Examples:
        "LEPPÄRINNE 5 A 10" -> ("LEPPÄRINNE 5", "A")
        "LEPPÄRINNE 5 B 15" -> ("LEPPÄRINNE 5", "B")
        "LEPPÄRINNE 10" -> ("LEPPÄRINNE 10", None)
        "KUUSIRINNE 4 A" -> ("KUUSIRINNE 4", "A")
        "LEPPÄRINNE 4 as 4" -> ("LEPPÄRINNE 4", None)
    
    Args:
        address: Full address string
    
    Returns:
        Tuple of (base_address, stairway_letter)
    """
    # Remove quotes if present
    address = address.strip('"')
    
    # Pattern 1: STREET NUMBER LETTER (with optional apartment number/info after)
    # The stairway letter is typically a single uppercase letter after the street number
    pattern = r'^(.+?\s+\d+)\s+([A-Z])(?:\s|$)'
    match = re.match(pattern, address)
    
    if match:
        base_address = match.group(1)
        stairway = match.group(2)
        return (base_address, stairway)
    
    # No stairway found
    return (address, None)


def group_orders_by_stairway(csv_file: str) -> Dict[str, Dict[str, List[Dict]]]:
    """
    Read CSV file and group orders by building and stairway.
    
    Args:
        csv_file: Path to CSV file
    
    Returns:
        Dictionary with structure:
        {
            "STREET NUMBER": {
                "A": [list of orders],
                "B": [list of orders],
                None: [list of orders without stairway]
            }
        }
    """
    grouped = defaultdict(lambda: defaultdict(list))
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            address = row.get('Osoite', '')
            base_address, stairway = parse_address(address)
            
            # Store the order with its full information
            grouped[base_address][stairway].append(row)
    
    return grouped


def format_output(grouped_orders: Dict[str, Dict[str, List[Dict]]]) -> str:
    """
    Format grouped orders into a readable output.
    
    Args:
        grouped_orders: Dictionary of grouped orders
    
    Returns:
        Formatted string output
    """
    output = []
    output.append("=" * 80)
    output.append("JAKOKIRJA - RYHMITELTY RAPUITTAIN")
    output.append("(Distribution List - Grouped by Stairway)")
    output.append("=" * 80)
    output.append("")
    
    # Sort buildings for consistent output
    for building in sorted(grouped_orders.keys()):
        stairways = grouped_orders[building]
        
        # Check if this building has multiple stairways
        has_stairways = any(s is not None for s in stairways.keys())
        
        if has_stairways:
            # Building with stairways
            output.append(f"\n{'─' * 80}")
            output.append(f"RAKENNUS: {building}")
            output.append(f"{'─' * 80}")
            
            # Sort stairways: letters first (A, B, C, ...), then None
            sorted_stairways = sorted(stairways.keys(), 
                                     key=lambda x: (x is None, x))
            
            for stairway in sorted_stairways:
                orders = stairways[stairway]
                
                if stairway is not None:
                    output.append(f"\n  RAPPU {stairway}:")
                    output.append(f"  {'-' * 76}")
                else:
                    output.append(f"\n  Muut osoitteet (ilman rappua):")
                    output.append(f"  {'-' * 76}")
                
                for order in orders:
                    output.append(f"    {order['Osoite']:30} | {order['Nimi']:25} | {order['Merkinnät']}")
        else:
            # Building without stairways
            output.append(f"\n{'─' * 80}")
            output.append(f"OSOITE (ei rappuja): {building}")
            output.append(f"{'─' * 80}")
            
            for orders in stairways.values():
                for order in orders:
                    output.append(f"  {order['Osoite']:30} | {order['Nimi']:25} | {order['Merkinnät']}")
    
    output.append("\n" + "=" * 80)
    output.append(f"Yhteensä {sum(len(orders) for building in grouped_orders.values() for orders in building.values())} tilausta")
    output.append("=" * 80)
    
    return "\n".join(output)


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Käyttö: python group_by_stairway.py <csv-tiedosto>")
        print("Usage: python group_by_stairway.py <csv-file>")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    
    try:
        grouped_orders = group_orders_by_stairway(csv_file)
        output = format_output(grouped_orders)
        print(output)
    except Exception as e:
        print(f"Virhe: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
