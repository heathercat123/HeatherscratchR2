#!/usr/bin/env python
from setuptools import setup, find_packages
from djangobb_forum import get_version

setup(name='djangobb_forum',
    version=get_version(),
    description='DjangoBB is a quick and simple forum which uses the Django Framework.',
    license='BSD',
    url='http://djangobb.org/',
    author='Alexey Afinogenov, Maranchuk Sergey',
    author_email='Maranchuk Sergey <slav0nic0@gmail.com>',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[], # Those are handled by HeatherscratchR2's requirements.txt
    keywords="django forum bb",
)
