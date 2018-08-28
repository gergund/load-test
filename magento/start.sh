#!/bin/bash
#GUI mode
#jmeter -t Checkout.jmx
#non-GUI mode
jmeter -n -t Checkout.jmx -l ../results/magento-150/results.csv -e -o ../results/magento-150/results
