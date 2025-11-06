#!/usr/bin/env python3
"""
Tests for group_by_stairway.py
"""

import unittest
from group_by_stairway import parse_address


class TestAddressParsing(unittest.TestCase):
    """Test address parsing functionality."""
    
    def test_address_with_stairway_and_apartment(self):
        """Test addresses with stairway letter and apartment number."""
        address = "LEPPÄRINNE 5 A 10"
        base, stairway = parse_address(address)
        self.assertEqual(base, "LEPPÄRINNE 5")
        self.assertEqual(stairway, "A")
    
    def test_address_with_stairway_no_apartment(self):
        """Test addresses with stairway letter but no apartment number."""
        address = "KUUSIRINNE 4 A"
        base, stairway = parse_address(address)
        self.assertEqual(base, "KUUSIRINNE 4")
        self.assertEqual(stairway, "A")
    
    def test_address_without_stairway(self):
        """Test addresses without stairway letter."""
        address = "LEPPÄRINNE 10"
        base, stairway = parse_address(address)
        self.assertEqual(base, "LEPPÄRINNE 10")
        self.assertIsNone(stairway)
    
    def test_address_with_as_notation(self):
        """Test addresses with 'as' notation (asunto)."""
        address = "LEPPÄRINNE 4 as 4"
        base, stairway = parse_address(address)
        self.assertEqual(base, "LEPPÄRINNE 4 as 4")
        self.assertIsNone(stairway)
    
    def test_address_with_special_notation(self):
        """Test addresses with special notation like 'lii'."""
        address = "HAVURINNE 3 lii 1"
        base, stairway = parse_address(address)
        self.assertEqual(base, "HAVURINNE 3 lii 1")
        self.assertIsNone(stairway)
    
    def test_multiple_stairways_same_building(self):
        """Test that different stairways are distinguished."""
        address1 = "LEPPÄRINNE 5 A 10"
        address2 = "LEPPÄRINNE 5 B 15"
        address3 = "LEPPÄRINNE 5 C 26"
        
        base1, stairway1 = parse_address(address1)
        base2, stairway2 = parse_address(address2)
        base3, stairway3 = parse_address(address3)
        
        # All should have same base
        self.assertEqual(base1, base2)
        self.assertEqual(base2, base3)
        
        # But different stairways
        self.assertEqual(stairway1, "A")
        self.assertEqual(stairway2, "B")
        self.assertEqual(stairway3, "C")
    
    def test_address_with_quotes(self):
        """Test that quotes are properly handled."""
        address = '"LEPPÄRINNE 5 A 10"'
        base, stairway = parse_address(address)
        self.assertEqual(base, "LEPPÄRINNE 5")
        self.assertEqual(stairway, "A")
    
    def test_complex_stairway_notation(self):
        """Test complex stairway notation like 'B 6 B'."""
        address = "LEPPÄRINNE 1 B 6 B"
        base, stairway = parse_address(address)
        self.assertEqual(base, "LEPPÄRINNE 1")
        self.assertEqual(stairway, "B")


class TestGroupingLogic(unittest.TestCase):
    """Test the grouping logic."""
    
    def test_building_grouping(self):
        """Test that addresses are grouped by building."""
        addresses = [
            "LEPPÄRINNE 5 A 10",
            "LEPPÄRINNE 5 B 15",
            "LEPPÄRINNE 10",
            "KUUSIRINNE 4 A"
        ]
        
        grouped = {}
        for addr in addresses:
            base, stairway = parse_address(addr)
            if base not in grouped:
                grouped[base] = []
            grouped[base].append(stairway)
        
        # Should have 3 buildings
        self.assertEqual(len(grouped), 3)
        
        # LEPPÄRINNE 5 should have 2 stairways
        self.assertEqual(len(grouped["LEPPÄRINNE 5"]), 2)
        self.assertIn("A", grouped["LEPPÄRINNE 5"])
        self.assertIn("B", grouped["LEPPÄRINNE 5"])


if __name__ == "__main__":
    unittest.main()
