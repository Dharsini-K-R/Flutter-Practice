import { PLACEHOLDER_PROCESS_ID_STRING } from "msa2-ui/src/services/Bpm";

export const bpmStarterDiagram =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  "<bpmn:definitions " +
  '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
  '  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
  '  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
  '  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
  '  id="Definitions_1" ' +
  '  targetNamespace="http://bpmn.io/schema/bpmn" ' +
  '  exporter="Camunda Modeler" ' +
  '  exporterVersion="4.2.0" ' +
  " >" +
  `  <bpmn:process id="${PLACEHOLDER_PROCESS_ID_STRING}" isExecutable="true">` +
  '    <bpmn:startEvent id="StartEvent_1" name="" />' +
  '    <bpmn:endEvent id="EndEvent_1" name="" />' +
  "  </bpmn:process>" +
  '  <bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
  '    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="PLACEHOLDER_PROCESS_ID">' +
  '      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">' +
  '        <dc:Bounds x="100" y="100" width="36" height="36" />' +
  "      </bpmndi:BPMNShape>" +
  '      <bpmndi:BPMNShape id="Event_0rpe2j4_di" bpmnElement="EndEvent_1">' +
  '        <dc:Bounds x="1000" y="100" width="36" height="36" />' +
  "      </bpmndi:BPMNShape>" +
  "    </bpmndi:BPMNPlane>" +
  "  </bpmndi:BPMNDiagram>" +
  "</bpmn:definitions>";
