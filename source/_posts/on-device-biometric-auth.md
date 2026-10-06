---
layout: project
title: On-Device Age & Gender Detection
date: 2025-10-06
description: Privacy-preserving facial age and gender estimation using browser-based ML
live_url: https://app.myklyo.com/lab/age-demo
tags:
    - Computer Vision
    - Face Recognition
    - Age Estimation
    - Machine Learning
    - ONNX Runtime
    - WebGPU
---

## Motivation

As web standards matured to support GPU acceleration and WebAssembly, I was interested in exploring how facial analysis could be performed entirely in the browser without sending images to cloud services. This approach offers better privacy, improved latency, and works completely offline—enabling real-time age and gender detection directly on user devices.

## Approach

The project demonstrates an on-device age and gender detection system that runs entirely in the browser using ONNX Runtime Web:

**Core Technologies**
- **MiVOLO Model**: State-of-the-art age and gender estimation model optimized for inference
- **ONNX Runtime Web**: Browser-based ONNX model execution with WebGPU acceleration
- **WebGPU Support**: Hardware-accelerated inference for real-time performance
- **Zero Cloud Transmission**: Facial images never leave the user's device

**Architecture**
- **Capture**: Real-time video feed from device camera
- **Face Detection**: Identify and isolate faces in the frame
- **Preprocessing**: Normalize and prepare face crops for model inference
- **Inference**: Fast MiVOLO model inference for age and gender prediction
- **Post-Processing**: Calibration and confidence scoring for results

**Key Features**
- **Real-time Performance**: Sub-100ms inference on modern hardware
- **Dual Predictions**: Simultaneous age and gender estimation per face
- **Calibration Data**: Comprehensive evaluation across demographic groups
- **Offline First**: Complete functionality without internet connection
- **Privacy Focused**: All processing happens locally; no data transmission

## Technical Highlights

- ONNX model export and optimization for browser deployment
- WebGPU integration for GPU-accelerated inference
- Calibration analysis revealing age estimation bias (~2.7 year average overage)
- Comprehensive evaluation harness for cross-device testing
- Face detection and preprocessing pipeline optimized for accuracy
- Graceful fallback for browsers without WebGPU support

This project demonstrated how modern web standards enable sophisticated machine learning directly in the browser while maintaining complete user privacy and control over personal data.
